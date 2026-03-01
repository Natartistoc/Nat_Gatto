import os

file_path = r'c:\Users\web\.gemini\antigravity\scratch\Nat_Gatto\index.html'

replacements = [
    (
        '''                            <h3 class="portfolio-title">Star Wars Super Teams</h3>
                            <p class="portfolio-location">
                                Teaser Director<br>3D Generalist<br>Cinematic Artist
                            </p>''',
        '''                            <h3 class="portfolio-title">Star Wars Super Teams</h3>
                            <p class="portfolio-location">
                                Full Teaser Creation<br>Storyboarding & Layout<br>Cinematic Artist
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title" style="letter-spacing: -0.01em;">Winter Is Coming | Cinematic
                            </h3>
                            <p class="portfolio-location">
                                Digital Painter<br>ART DIRECTOR<br>Cinematic Artist
                            </p>''',
        '''                            <h3 class="portfolio-title" style="letter-spacing: -0.01em;">Winter Is Coming | Cinematic
                            </h3>
                            <p class="portfolio-location">
                                Digital Painter<br>AI-Driven Art Direction<br>AI-Driven Animation
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">ORC WARRIOR | CINEMATIC</h3>
                            <p class="portfolio-location">
                                PBR Texturing & Lookdev<br>AI Cinematic Animation
                            </p>''',
        '''                            <h3 class="portfolio-title">ORC WARRIOR | CINEMATIC</h3>
                            <p class="portfolio-location">
                                Concept Creator<br>Advanced Digital pipeline<br>AI-Driven Animation
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">Beach Buggy</h3>
                            <p class="portfolio-location">
                                Hard Surface Modeling<br>PBR Texturing<br>AI Generative Animation
                            </p>''',
        '''                            <h3 class="portfolio-title">Beach Buggy</h3>
                            <p class="portfolio-location">
                                Hard Surface Modeling<br>PBR Texturing<br>AI-Driven Animation
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">FLASHLIGHT 1950</h3>
                            <p class="portfolio-location">
                                Hard Surface Modeling &middot; Substance Painter<br>Low-Poly Modeling<br>Real-Time
                                Lookdev
                            </p>''',
        '''                            <h3 class="portfolio-title">FLASHLIGHT 1950</h3>
                            <p class="portfolio-location">
                                Hard Surface Modeling<br>PBR Texturing<br>Real-Time Loodev
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">Sonic Super Teams</h3>
                            <p class="portfolio-location">
                                Figurine Artist<br>Production Asset Artist<br>Real-Time Adaptation Artist
                            </p>''',
        '''                            <h3 class="portfolio-title">Sonic Super Teams</h3>
                            <p class="portfolio-location">
                                3D Design Creation from 2D Concepts<br>Figurine Sculptor for Molding Production<br>Figurine Adaptation and Rework for the Teaser
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">Planet of the Apes</h3>
                            <p class="portfolio-location">
                                Figurine Artist<br>Character Design<br>Boardgame miniatures
                            </p>''',
        '''                            <h3 class="portfolio-title">Planet of the Apes</h3>
                            <p class="portfolio-location">
                                Figurine Sculptor for molding production<br>Character Designer<br>Boardgame Miniatures
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">
                                Duplik | the new editions</h3>
                            <p class="portfolio-location">
                                Figurine Artist&nbsp;&nbsp;Production Asset Artist&nbsp;&nbsp;Product Design
                            </p>''',
        '''                            <h3 class="portfolio-title">
                                Duplik | the new editions</h3>
                            <p class="portfolio-location">
                                Game Assets Recreation<br>PBR Texturing<br>Marketing Renders
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">Magnum Opus</h3>
                            <p class="portfolio-location">Game Asset</p>''',
        '''                            <h3 class="portfolio-title">Magnum Opus</h3>
                            <p class="portfolio-location">
                                3D Design Creation<br>Sculptor for Molding Production<br>Product Preview |Print Preparation
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">Son Goku</h3>
                            <p class="portfolio-location">Stylized Character
                            </p>''',
        '''                            <h3 class="portfolio-title">Son Goku</h3>
                            <p class="portfolio-location">
                                Fan Art–Based Sculpture<br>My First Figurine for 3D Printing<br>Dynamic Posing & Gesture
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">
                                WINTER IS COMING | PAINTING</h3>
                            <p class="portfolio-location">
                                Digital Painting<br>ILLUSTRATION
                            </p>''',
        '''                            <h3 class="portfolio-title">
                                WINTER IS COMING | PAINTING</h3>
                            <p class="portfolio-location">
                                Light-Driven Composition<br>Material Readability & Contrast<br>Atmospheric Depth & Environment
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">
                                Spiderman Infinity</h3>
                            <p class="portfolio-location">Illustration</p>''',
        '''                            <h3 class="portfolio-title">
                                Spiderman Infinity</h3>
                            <p class="portfolio-location">
                                Fan Art–Based Illustration<br>Digital Painting<br>Dynamic Pose & Action Lines
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">Saint Seiya
                            </h3>
                            <p class="portfolio-location">Illustration</p>''',
        '''                            <h3 class="portfolio-title">Saint Seiya
                            </h3>
                            <p class="portfolio-location">
                                Fan Art–Based Illustration<br>Digital Painting<br>Poster-Size Artwork
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">
                                Warhammer 40000</h3>
                            <p class="portfolio-location">Illustration</p>''',
        '''                            <h3 class="portfolio-title">
                                Warhammer 40000</h3>
                            <p class="portfolio-location">
                                Dynamic Composition & Posing<br>High-Fidelity Detail Rendering<br>Perspective & Dramatic Narrative
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">Batoon</h3>
                            <p class="portfolio-location">
                                Character Design&Development<br>Illustration<br>Cartoon
                            </p>''',
        '''                            <h3 class="portfolio-title">Batoon</h3>
                            <p class="portfolio-location">
                                Character Design & Developpment<br>Illustration<br>Cartoon
                            </p>'''
    ),
    (
        '''                            <h3 class="portfolio-title">Bubble Blower</h3>
                            <p class="portfolio-location">Illustration</p>''',
        '''                            <h3 class="portfolio-title">Bubble Blower</h3>
                            <p class="portfolio-location">
                                ...This Project<br>Is Coming<br>Soon...
                            </p>'''
    )
]

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for target, replacement in replacements:
    if target in content:
        content = content.replace(target, replacement)
    else:
        # Try to match with single lines if multi-line match fails due to line endings
        print(f"Warning: Target not found exactly: {target[:50]}...")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Update complete for index.html")
