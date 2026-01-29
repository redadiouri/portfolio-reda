# 📸 Guide d'optimisation des images

## 🎯 Objectif
Réduire la taille des images de **8.7 MB** à moins de **500 KB** sans perte de qualité.

---

## 🖼️ Images à optimiser

| Image | Résolution actuelle | Résolution affichée | Taille actuelle |
|-------|-------------------|-------------------|-----------------|
| **reda.JPG** | 4480x4480 | 300x300 | 6.4 MB |
| **MLA.png** | 1536x1024 | 270x180 | 2.2 MB |
| **maison.JPG** | 3815x2729 | 252x180 | 181 KB |

---

## 📝 Instructions étape par étape

### **Option 1 : Utiliser TinyPNG (Recommandé - Gratuit)**

1. **Allez sur** : https://tinypng.com
2. **Uploadez vos images** une par une
3. **Téléchargez** les versions compressées
4. **Renommez** comme suit et placez dans `img/` :
   - `reda.jpg` (version optimisée)
   - `mla.png` (version optimisée)
   - `maison.jpg` (version optimisée)

---

### **Option 2 : Utiliser FFmpeg en ligne de commande (Avancé)**

Si vous avez FFmpeg installé :

```bash
# 1. Réduire et compresser reda.JPG
ffmpeg -i img/reda.JPG -resize 300x300 -q:v 6 img/reda.jpg

# 2. Réduire et compresser MLA.png
ffmpeg -i img/MLA.png -resize 270x180 -q:v 7 img/mla.png

# 3. Réduire et compresser maison.JPG
ffmpeg -i img/maison.JPG -resize 252x180 -q:v 6 img/maison.jpg
```

---

### **Option 3 : Utiliser ImageMagick (Windows/Mac/Linux)**

Installation : `choco install imagemagick` (Windows)

```bash
# 1. Reda - Profile image
magick convert img/reda.JPG -resize 300x300 -quality 80 img/reda.jpg

# 2. MLA - Project image
magick convert img/MLA.png -resize 270x180 -quality 85 img/mla.png

# 3. Maison - Project image
magick convert img/maison.JPG -resize 252x180 -quality 80 img/maison.jpg
```

---

## 🚀 Créer les versions WebP (Bonus - pour meilleure compression)

**WebP réduit la taille de 25-35% supplémentaires !**

### Avec FFmpeg :
```bash
ffmpeg -i img/reda.jpg -c:v libwebp -quality 80 img/reda.webp
ffmpeg -i img/mla.png -c:v libwebp -quality 85 img/mla.webp
ffmpeg -i img/maison.jpg -c:v libwebp -quality 80 img/maison.webp
```

### Avec ImageMagick :
```bash
magick convert img/reda.jpg -quality 80 img/reda.webp
magick convert img/mla.png -quality 85 img/mla.webp
magick convert img/maison.jpg -quality 80 img/maison.webp
```

### Avec un outil en ligne :
- https://cloudconvert.com (gratuit pour 25 conversions/jour)
- https://ezgif.com/jpg-to-webp

---

## 📂 Structure finale attendue

```
img/
├── reda.JPG           # Original (à conserver comme backup)
├── reda.jpg           # Optimisé 300x300
├── reda.webp          # WebP optimisé (bonus)
├── reda@2x.jpg        # Haute résolution (600x600)
├── reda@2x.webp       # Haute résolution WebP
│
├── MLA.png            # Original
├── mla.png            # Optimisé 270x180
├── mla.webp           # WebP optimisé
├── mla@2x.png         # Haute résolution
├── mla@2x.webp        # Haute résolution WebP
│
├── maison.JPG         # Original
├── maison.jpg         # Optimisé 252x180
├── maison.webp        # WebP optimisé
├── maison@2x.jpg      # Haute résolution
└── maison@2x.webp     # Haute résolution WebP
```

---

## ✅ Résultats attendus

### Avant (Lighthouse)
- **Taille totale** : 8.7 MB
- **Économies** : 8.7 MB

### Après cette optimisation
- **Taille totale** : 400-500 KB
- **Réduction** : 95% ! 🚀
- **LCP amélioré** : de 3-5s → 1-2s

---

## 🎓 Commandes rapides à copier-coller

### Pour TinyPNG automatisé (Node.js)
```bash
npm install -g tinypng-cli
tinypng-cli --key YOUR_API_KEY img/*.jpg img/*.png
```

### Script bash complet (Linux/Mac)
```bash
#!/bin/bash
# Créer versions optimisées
magick convert img/reda.JPG -resize 300x300 -quality 80 img/reda.jpg
magick convert img/MLA.png -resize 270x180 -quality 85 img/mla.png
magick convert img/maison.JPG -resize 252x180 -quality 80 img/maison.jpg

# Créer versions WebP
magick convert img/reda.jpg -quality 80 img/reda.webp
magick convert img/mla.png -quality 85 img/mla.webp
magick convert img/maison.jpg -quality 80 img/maison.webp

echo "✅ Images optimisées !"
```

---

## 💡 Points clés

✅ **Lazy loading** : Activé avec `loading="lazy"`
✅ **Responsive images** : `srcset` pour mobile/desktop/retina
✅ **Format moderne** : WebP + JPG/PNG fallback
✅ **Bonnes dimensions** : Images redimensionnées aux bonnes tailles
✅ **Compression** : Quality 80-85 pour JPG/PNG/WebP

---

## 🔗 Ressources utiles

- [MDN - Picture Element](https://developer.mozilla.org/fr/docs/Web/HTML/Element/picture)
- [WebP Format Guide](https://developers.google.com/speed/webp)
- [ImageOptim](https://imageoptim.com) (Mac)
- [FileOptimizer](https://nikkhokkho.sourceforge.io/static.php?page=FileOptimizer) (Windows)
