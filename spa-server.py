#!/usr/bin/env python3
import http.server
import socketserver
import os
from pathlib import Path

PORT = 3020
DIRECTORY = "evonft-app/dist"

class SPAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        # Get the file path
        path = self.translate_path(self.path)
        
        # If file exists, serve it normally
        if os.path.isfile(path):
            return super().do_GET()
        
        # If it's a directory and has index.html, serve it
        if os.path.isdir(path):
            index_path = os.path.join(path, 'index.html')
            if os.path.isfile(index_path):
                return super().do_GET()
        
        # Otherwise, serve index.html for SPA routing
        self.path = '/index.html'
        return super().do_GET()

with socketserver.TCPServer(("", PORT), SPAHTTPRequestHandler) as httpd:
    print(f"Serving SPA at http://localhost:{PORT}")
    print(f"Directory: {DIRECTORY}")
    print("Press Ctrl+C to stop")
    httpd.serve_forever()
