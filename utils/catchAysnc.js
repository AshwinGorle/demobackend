module.exports= catchAsync= fn => {
    return(req,res,next)=>{
      fn(req,res,next).catch((err)=>{
        // res.status(500).json({ error: "Internal Server Error" });
        console.log(err)
        next
      }
     )
    }
  }

  