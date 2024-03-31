module.exports= catchAsync= fn => {
    return(req,res,next)=>{
      fn(req,res,next).catch(()=>{
        res.status(500).json({ error: "Internal Server Error" });
        next
      }
     )
    }
  }