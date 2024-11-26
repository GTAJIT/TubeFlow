

export const ApiResponse = (status: number, message: string, data: any = null, error: any = null)=>{
    return {
        status,
        message,
        error,
        data
    }
}