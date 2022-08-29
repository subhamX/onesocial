import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Link from "next/link";
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar";
import { DASHBOARD_URL, NEW_USER_WELCOME_URL } from "../config/ScreenRoutes";
import { Query } from "../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";
import styles from '../styles/Landing.module.css'

const Home: NextPage = () => {

  const { loading, data } = useQuery<Query>(GET_CURRENT_USER)

  const isLoggedIn = (!loading && !!data?.getCurrentUser);


  return (
    <>
      <div>
        <MainSiteNavbar />

        <div className="mx-auto max-w-7xl px-4 bg-base-100">

          <div className="flex flex-col-reverse gap-7 items-center sm:flex-row w-full justify-center sm:justify-around min-h-[65vh] text-center">
            <div className="mockup-window border bg-gray-100 border-gray-700">
              <div className="flex justify-center border-t border-gray-200">
                <img src="/neww1.png" className="w-full max-w-[600px] object-left border-t border-black" />
                {/* <img src="/neww123.png" className="w-full max-w-[500px] object-left border-t border-black" /> */}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <div className={styles["scrolling-words-container"]}>
                <div>The ultimate super app for</div>
                <div className={styles['scrolling-words-box']}>
                  <ul>
                    <li style={{ "color": "#4285f4" }}>mentors</li>
                    <li style={{ "color": "#ea4335" }}>creators</li>
                    <li style={{ "color": "#34a853" }}>designers</li>
                    <li style={{ "color": "#fbbc04" }}>consultants</li>
                    <li style={{ "color": "#ea4335" }}>professionals</li>
                  </ul>
                </div>
                <div>and their audience.</div>
              </div>
              <Link href={isLoggedIn ? DASHBOARD_URL : NEW_USER_WELCOME_URL}>
                <button className="btn normal-case bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:bg-gradient-to-l">{isLoggedIn ? 'Go to Dashboard' : 'Get Started for free'}</button>
              </Link>
            </div>

          </div>



          <div id="features" className="max-w-4xl mx-auto font-black text-xl sm:text-2xl grid grid-cols-1 sm:grid-cols-2 gap-28 mb-32">

            <Card
              content="Manage your blog, newsletter, events, and more all in one place."
              imgUrl="/content-manage.svg" />

            <Card
              content="Create and share content on your own website or on our platform."
              imgUrl="/urban-line-scientists-studying-atom-by-the-computer.svg" />

            <Card
              content="Discover the best of events around your place, and get involved in the community."
              imgUrl="/urban-line-women-create-a-website-using-a-laptop-and-a-desktop-computer-1.svg" />

            <Card
              content="Find the best professionals to help you in your task with their expertise."
              imgUrl="/boba-recruiter-finding-the-perfect-candidate.svg" />

            <Card
              content="Use our integrated chat, and video conferencing tools to provide your digital services."
              imgUrl="/collage.png" />

            <Card
              content="Selling digital products wouldn't be this easy. Within a few clicks you can reach thousands of customers."
              imgUrl="/dazzle-line-paintings-for-sale-nft.svg" />

            {/* <Card
              content="This app is open source with Apache license!"
              imgUrl="/Open source-cuate.svg" /> */}

          </div>

        </div>
      </div>

    </>
  );
};

export default Home;


const Card = ({ content, imgUrl }: { content: string, imgUrl: string }) => (
  <div className="card card-side bg-base-100 shadow-xl border border-gray-400 px-8 py-10 hover:scale-105 transition-transform">
    <div className="grid gap-5 items-center">
      <img src={imgUrl} className="w-[300px] sm:w-[400px]" />
      <div>
        {content}
      </div>
    </div>
  </div>

)
