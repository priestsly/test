import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ConnectWallet } from "@thirdweb-dev/react";


/**
 * Landing page with a simple gradient background and a hero asset.
 * Free to customize as you see fit.
 */
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <div className="mt-64">
            <div className={styles.heroBackgroundInner} mt-32>
              <Image
                src="/hero-gradient.png"
                width={1390}
                height={1390}
                alt="Background gradient from red to blue"
                quality={100}
                className={styles.gradient}
              />
            </div>
          </div>
      
          <div className={styles.heroBodyContainer}>
            <div className={styles.heroBody}>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleGradient}>
                AI Reward Box
                </span>
                <br />
                smarter than ever.
              </h1>
              <p className="text-lg">
              
              Rewards created entirely on decentralized smart contracts
              </p>

              <div className={styles.heroCtaContainer}>
                <Link className={styles.heroCta} href="/buy">
                  Buy NFT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
