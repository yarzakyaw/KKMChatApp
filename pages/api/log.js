export default function handler(req, res) {  
    const { message } = req.body;  
    console.log(message); // Log to the terminal  
    res.status(200).json({ success: true });
  }