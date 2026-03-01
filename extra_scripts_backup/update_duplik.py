import os

file_path = r'c:\Users\web\.gemini\antigravity\scratch\Nat_Gatto\project-duplik.html'

target = '''                        <div class="meta-item" style="text-align:left; width:100%; margin-bottom: 25px;">
                            <span class="meta-label" style="display:block; margin-bottom:10px;">Role:</span>
                            <span class="meta-value">3D Artist &bull; Product Visualization &bull; Lead 3D
                                Marketing</span>
                        </div>'''

replacement = '''                        <div class="meta-item" style="text-align:left; width:100%; margin-bottom: 25px;">
                            <span class="meta-label" style="display:block; margin-bottom:10px;">Role:</span>
                            <span class="meta-value">3D Artist &bull; Product Visualization</span>
                        </div>'''

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if target in content:
    content = content.replace(target, replacement)
    print("Update complete for project-duplik.html")
else:
    print("Target not found in project-duplik.html")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
