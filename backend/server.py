from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
import numpy as np
from PIL import Image
import io
import requests
from trellis.pipelines import TrellisImageTo3DPipeline
import os
import tempfile

app = Flask(__name__)
CORS(app)

# Initialize the TRELLIS pipeline
pipeline = None

def init_pipeline():
    global pipeline
    if pipeline is None:
        pipeline = TrellisImageTo3DPipeline.from_pretrained("JeffreyXiang/TRELLIS-image-large")
        pipeline.cuda()
        # Preload rembg
        try:
            pipeline.preprocess_image(Image.fromarray(np.zeros((512, 512, 3), dtype=np.uint8)))
        except:
            pass

def download_image(url):
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to download image: {response.status_code}")
    return Image.open(io.BytesIO(response.content))

@app.route('/start-session', methods=['POST'])
def start_session():
    try:
        init_pipeline()
        return jsonify({"message": "Session started successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/convert', methods=['POST'])
def convert():
    try:
        data = request.json
        if not data or 'imageUrl' not in data:
            return jsonify({"error": "No image URL provided"}), 400

        # Download and process the image
        image = download_image(data['imageUrl'])
        
        # Get parameters from request
        parameters = data.get('parameters', {})
        
        # Run the pipeline
        outputs = pipeline.run(
            image,
            seed=0,
            formats=["gaussian", "mesh"],
            preprocess_image=True,
            sparse_structure_sampler_params={
                "steps": parameters.get('ss_sampling_steps', 12),
                "cfg_strength": parameters.get('ss_guidance_strength', 7.5),
            },
            slat_sampler_params={
                "steps": parameters.get('slat_sampling_steps', 12),
                "cfg_strength": parameters.get('slat_guidance_strength', 3.0),
            },
        )

        # Extract the mesh
        mesh = outputs['mesh'][0]
        
        # Create temporary file for GLB
        with tempfile.NamedTemporaryFile(suffix='.glb', delete=False) as tmp:
            # Export the mesh to GLB
            mesh.export(tmp.name)
            
            # Send the file
            return send_file(
                tmp.name,
                mimetype='model/gltf-binary',
                as_attachment=True,
                download_name='model.glb'
            )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "pipeline_initialized": pipeline is not None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003) 