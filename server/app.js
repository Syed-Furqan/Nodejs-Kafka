const express = require('express')
const app = express()

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9094']
})

const producer = kafka.producer()
const consumer = kafka.consumer({groupId: "node-group"})


const run = async () => {
    // Producing
    await producer.connect()
    console.log("Producer connected")
    await producer.send({
      topic: 'orders',
      messages: [
        { value: 'Orders coming 2..' }
      ]
    })
    console.log("Message sent")

    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'orders', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value.toString(),
          })
        },
    })
}
run().catch(console.error)

app.use(express.json())

app.listen(3333, () => {
    console.log('Server has Started')
})