## Sitio estático para publicar PDFs (GitLab Pages)

Proyecto simple con HTML/CSS/JS para listar y visualizar PDFs. Despliegue automático en GitLab Pages.

### Estructura

```
public/
  index.html
  styles.css
  scripts.js
  pdfs/
    manifest.json
    (tus-archivos.pdf)
.gitlab-ci.yml
```

### Probar localmente

1. Abre `public/index.html` en tu navegador.
2. Opcional: usa "Probar con un PDF local" para cargar un PDF desde tu PC (no se sube).

### Publicar el primer PDF (automático)

1. Copia un archivo PDF a `public/pdfs/`, por ejemplo `ejemplo.pdf`.
2. Haz commit y push a la rama principal por defecto (`main` o `master`).
3. El pipeline generará `public/pdfs/manifest.json` automáticamente con los PDFs encontrados.
4. GitLab ejecutará el job `pages` y publicará el sitio.
5. Accede a la URL de Pages: `https://<usuario-o-grupo>.gitlab.io/<repositorio>/`.

### Límite de tamaño

Sube hasta 9 PDFs que en conjunto no excedan 100 MB.

### Notas

- El listado se genera desde `public/pdfs/manifest.json`.
- El botón "Abrir integrado" usa un `<iframe>` para visualizar el PDF.


