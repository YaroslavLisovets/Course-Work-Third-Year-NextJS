import Feed from "@components/Feed";

const Page = () => {
    return (
        <section className="w-full flex-center flex-col">
            <h1 className="head_text text-center">
                Discover & Share
                <br className="mad-md:hidden"/>
                <span className="orange_gradient text-center">Penis</span>
            </h1>
            <p className="desc text-center">
                What and awesome description
            </p>
            <Feed />
        </section>
    );
};

export default Page;