import os
from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename

import subprocess

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ✅ Allow only DOCX files
ALLOWED_EXTENSIONS = {"docx"}
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/convert", methods=["POST"])
def convert_to_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        pdf_filename = filename.rsplit(".", 1)[0] + ".pdf"
        pdf_filepath = os.path.join(OUTPUT_FOLDER, pdf_filename)
        
        try:
            # ✅ Convert DOCX to PDF using Pandoc
            subprocess.run(["pandoc", filepath, "-o", pdf_filepath], check=True)

            return send_file(pdf_filepath, as_attachment=True)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid file type"}), 400

if __name__ == "__main__":
    app.run(debug=True)
