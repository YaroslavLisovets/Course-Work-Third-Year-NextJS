import '@styles/gloabals.css';

export const metadata = {
    title: "Hiking Club",
    description: ""
}
import Nav from "@components/Nav";
import Provider from "@components/Provider";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (

        <html>
        <body>
        <Provider>
            <div className="main">
                <div className="gradient">

                </div>
            </div>

            <main className="app">
                <Nav/>
                {children}
            </main>
        </Provider>
        </body>
        </html>
    )
}
