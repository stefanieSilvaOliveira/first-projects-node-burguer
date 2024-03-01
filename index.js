const express = require('express')
const uuid = require('uuid')
const cors = require('cors');

const port = process.env.PORT || 3001;
const app = express()
app.use(express.json())
app.use(cors());

const orders = [];

const checkOrderId = (request, response, next) =>{
    const {id} = request.params
    
    const index = orders.findIndex(order => order.id ===id)
    
    if(index < 0){
        return response.status(404).json({error: "User not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const metMiddleware = (request,response,next) =>{
    console.log(`Metodo:${request.method}, URL:${request.originalUrl}`)

    next()

    app.use(metMiddleware)
}

app.post('/order', (request, response) =>{
    const {name,order} = request.body

    const orderNew = {id:uuid.v4(),name,order}
    
    orders.push(orderNew)
    
    return response.status(201).json(orderNew)
})

app.get('/order', (request, response) =>{
    return response.json(orders)
})


app.put('/order/:id',checkOrderId, (request, response) =>{
       
       const {order, clientName, price, status} = request.body
       const index = request.orderIndex 
       const id = request.orderId
       
       const updateOrder = {id, order, clientName, price, status}
       
       orders[index] = updateOrder
       return response.json(updateOrder)
})

app.delete('/order/:id',checkOrderId, (request, response) =>{
 
    const index = request.orderIndex
    
    orders.splice(index,1);
    
    return response.status(204).json()
})

app.get('/order/:id', (request, response) =>{
    
    const { id } = request.params
    
    const index = orders.find(order =>order.id === id)

    if(index < 0){
        return response.status(404).json({error: "Order not found"})
    }

    return response.json(index)
})



app.patch('/order/:id', (request, response) => {
    const {id} = request.params
    const orderIndex = orders.findIndex((order) => order.id ===id)
    
    orders[orderIndex].status= "Pronto"
    return response.json(orders[orderIndex])
})

app.listen(port, () =>{
    console.log(`🚀 Server started on port ${port}`)
})

