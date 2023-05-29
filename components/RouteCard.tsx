
//@ts-ignore
export default function Page(route){
    route = route.route
    return (
        <a href={`/routes/${route.id}`}>
            <div
                className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8 p-8">
                <div className="flex flex-col items-center">
                    <div className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Route Name: {route.name}</div>
                    <div>Rate: {route.rate||5}/5</div>
                    <div>Difficulty: {route.difficulty}/10</div>

                </div>
            </div>
        </a>
    )
}