const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors = require('cors'); 
const Todo=require('./models/Todo');



const app=express();
const port=3000;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
//mongodb connection
// : is encoded as %3A.

// / is encoded as %2F.

// @ is encoded as %40.

// . is encoded as %2E.

// ? is encoded as %3F.
mongoose.connect('mongodb+srv://mounika:PhzLZ4jeqZtWL466@todo-cluster.repf28f.mongodb.net/?retryWrites=true&w=majority&appName=todo-cluster');
const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('connectionto MongoDB');
})

//adding routes
app.get('/api/todos',async(req,res)=>{
    try{
        const todos=await Todo.find();
        res.json(todos);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});
app.post('/api/todos',async(req,res)=>{
    const todo=new Todo({
        text:req.body.text
    });
    try{
        const newTodo=await todo.save();
        res.status(201).json(newTodo);
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'Cannot find todo' });
    }
    if (req.body.text != null) {
      todo.text = req.body.text;
    }
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'Cannot find todo' });
    }
    await todo.deleteOne();
    res.json({ message: 'Deleted Todo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//() indicate no parameter
app.listen(port,() => {
    console.log(`server is running on port ${port}`);
})