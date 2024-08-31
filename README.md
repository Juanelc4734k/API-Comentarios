# API de Comentarios - Documentación

Esta API permite gestionar comentarios para publicaciones, incluyendo la creación, aprobación y recuperación de comentarios anidados.

## Endpoints

### 1. Crear un comentario

Este endpoint permite crear un nuevo comentario.

#### Postman

- Método: POST
- URL: `http://localhost:3000/comments`
- Headers: 
  - Content-Type: application/json
- Body (raw JSON):
  ```json
  {
    "content": "Este es un comentario de prueba",
    "author_id": 1,
    "post_id": 1,
    "parent_comment_id": null
  }
  ```

#### cURL

```bash
curl -X POST http://localhost:3000/comments \
     -H "Content-Type: application/json" \
     -d '{"content":"Este es un comentario de prueba","author_id":1,"post_id":1,"parent_comment_id":null}'
```

### 2. Obtener comentarios de una publicación

Este endpoint permite obtener todos los comentarios aprobados para una publicación específica, organizados en una estructura jerárquica.

#### Postman

- Método: GET
- URL: `http://localhost:3000/comments/post/{postId}`
- Reemplaza `{postId}` con el ID de la publicación deseada.

#### cURL

```bash
curl http://localhost:3000/comments/post/1
```

### 3. Aprobar un comentario

Este endpoint permite aprobar un comentario existente.

#### Postman

- Método: PATCH
- URL: `http://localhost:3000/comments/{id}/approve`
- Reemplaza `{id}` con el ID del comentario que deseas aprobar.

#### cURL

```bash
curl -X PATCH http://localhost:3000/comments/1/approve
```

## Estructura de la base de datos

La API utiliza MySQL con la siguiente estructura de tabla:

### Tabla: comments

```sql
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    post_id INT NOT NULL,
    parent_comment_id INT,
    is_approved BOOLEAN DEFAULT FALSE,	
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```



## Configuración del proyecto

1. Instala las dependencias:
   ```bash
   npm install express mysql2
   ```

2. Configura la conexión a la base de datos en `db.js`.

3. Inicia el servidor:
   ```bash
   node server.js
   ```

## Notas adicionales

- Los comentarios recién creados no están aprobados por defecto.
- Solo los comentarios aprobados son devueltos en las consultas.
- La estructura de comentarios anidados se maneja mediante el campo `parent_comment_id`.


Happy hacking!




