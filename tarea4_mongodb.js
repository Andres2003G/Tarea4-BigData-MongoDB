// ==========================================
// TAREA 4 - BIG DATA - MONGODB
// Caso de uso: Marketplace de Tecnología
// ==========================================

use marketplace_tech;

// 1. INSERCIÓN DE DATOS
const categorias = ["Portátiles","Celulares","Audio","Monitores","Accesorios"];
const marcas = ["Lenovo","Samsung","Sony","LG","Logitech"];
let productos = [];
for (let i = 1; i <= 120; i++) {
  productos.push({
    sku: "SKU" + String(i).padStart(3,"0"), nombre: "Producto " + i,
    categoria: categorias[i % categorias.length], marca: marcas[i % marcas.length],
    precio: Number((200 + Math.random()*3000).toFixed(2)), stock: Math.floor(Math.random()*200),
    especificaciones: { garantia_meses: 12, color: "Negro" }, etiquetas: ["tecnologia"], activo: true
  });
}
db.productos.insertMany(productos);

// 2. CONSULTA BÁSICA
db.productos.find({ categoria: "Audio", precio: { $lt: 1000 } })

// 3. ACTUALIZACIÓN Y ELIMINACIÓN
db.productos.updateMany({ marca: "Sony" }, { $mul: { precio: 0.90 } })
db.pedidos.deleteMany({ estado: "cancelado" })

// 4. OPERACIÓN TIPO JOIN ($lookup)
db.pedidos.aggregate([
  {
    $lookup: {
      from: "clientes",
      localField: "cliente_id",
      foreignField: "_id",
      as: "datos_cliente"
    }
  }
])

// 5. AGREGACIONES ($group, $avg, $sum)
db.productos.aggregate([
  {
    $group: {
      _id: "$categoria",
      precio_promedio: { $avg: "$precio" },
      total_stock: { $sum: "$stock" }
    }
  }
])
