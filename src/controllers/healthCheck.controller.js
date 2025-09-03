import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const notCheck = (req, res) => {
    try {
        res.status(200)
       .json(new ApiResponse(200, { message: 'instagram server running' }));

    } catch (error) {
        console.log(`error:${error}`);
    }
}

const healthCheck = asyncHandler(async(req,res)=>{
   res.status(200)
   .json(new ApiResponse(200,{message:"server is still running"}))
})

export { healthCheck, notCheck } 