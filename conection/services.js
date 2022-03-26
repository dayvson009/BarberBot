const db = require('./conectdb.js')

db.connect()

const showProducts = async () => {


  const barbearia = `SELECT * FROM barbearia`;

  try {
    let consulta = await db.query(barbearia)
    
    console.log(consulta.rows)

  } catch(err){

    console.log(err)

  } finally{
    db.end()
  }
}
/*
const insertProduct = async (data) => {
  m2 = data.metroquadrado == 'true' ? true : false;
  const sql = `INSERT INTO public.produtos (nomeproduto, descicaoproduto, categoriaproduto, metroquadrado) VALUES ('${data.name}','${data.description}','${data.category}', ${data.metroquadrado})`;
  queryProducts = await db.query(sql)

  sqlLastId = `SELECT idproduto FROM public.produtos ORDER BY idproduto DESC`;
  lastId = await db.query(sqlLastId)

  console.log("-------")
  console.log(lastId.rows[0].idproduto)

  data.price = converterEmPonto(data.price)
  data.cost = converterEmPonto(data.cost)

  const sqlvalues = `INSERT INTO public.valores (idproduto, quantidade, preco, custo) VALUES ('${lastId.rows[0].idproduto}','${data.amount}','${data.price}','${data.cost}')`;
  await db.query(sqlvalues)
  .then(res =>{ console.log(res)})
  .catch(err =>{ console.log(err)})
}

const deleteProduct = async (id) => {

  const sqlValues = `DELETE FROM public.valores WHERE idproduto = ${id}`;
  const deleteValores = await db.query(sqlValues)

  const sqlProducts = `DELETE FROM public.produtos WHERE idproduto = ${id}`;
  const deleteVal = await db.query(sqlProducts)
}

const deleteValues = async (id) => {
  const sqlValues = `DELETE FROM public.valores WHERE idvalor = ${id}`;

  try {
    const deleteValores = await db.query(sqlValues)
  } finally {
  }
}


const updateValues = async ({idvalue, valor, quantidade, custo} = data) => {
  valor = converterEmPonto(valor)
  custo = converterEmPonto(custo)

  const sql = `UPDATE public.valores set quantidade=${quantidade}, preco=${valor}, custo=${custo} WHERE idvalor=${idvalue}`;
  const result = await db.query(sql)
}
*/


module.exports = {
  showProducts: showProducts
}