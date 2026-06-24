

module.exports=(req,res,next)=>{

    if(!req.session.usuario){

        return res.status(401).json({

            mensaje:"No autorizado"

        });

    }

    next();

};