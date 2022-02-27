const express = require('express')
const uuid = require('uuid')

const port = 3000

const app = express()
app.use(express.json())

app.get('/order', (request, response) => {
    return response.json(orders)
})

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({ message: "User not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const requests = (request, response, next) =>{
    const method = request.route.methods
    const url = request.route.path
    console.log(method, url)

    next()
}

app.post('/order', (request, response) => {
    const { order, clientName, price} = request.body
    const status = "Em preparação"

    const orderClient = { id: uuid.v4(), order, clientName, price, status}

    orders.push(orderClient)

    return response.status(201).json(orderClient)
})

app.put('/order/:id', checkOrderId, requests, (request, response) => {
    const { order, clientName, price} = request.body
    const status = "Em preparação"

    const id = request.orderId
    const index = request.orderIndex

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder
    
    return response.json(updateOrder)
})

app.delete('/order/:id', checkOrderId, requests, (request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(204).json()
})

app.get('/order/:id',checkOrderId,requests, (request, response) => {
    const index = request.orderIndex

    return response.json(orders[index])
})


app.patch('/order/:id',checkOrderId,requests, (request,response)=>{

    const index = request.orderIndex

    orders[index].status = "Finalizado"

    return response.json(orders[index])
})


app.listen(port, () => {
    console.log(`Rodaaaaaaando porta ${port}`)
})