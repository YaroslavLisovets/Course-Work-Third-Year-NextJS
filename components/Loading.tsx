// @ts-ignore
export default ({isLoading}) => {
    return (
        <div>
            {isLoading && (
                <div className=" flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mt-16"></div>
                </div>)}
        </div>


    )
}