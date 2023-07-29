import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

export function Navbar() {
  const address = useAddress();

  return (
    <div className="border-b-2 border-cyan-900 flex justify-center">
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.link} ${styles.navLeft}`}>
            Home
          </Link>

          <div className={styles.navMiddle}>
            <Link href="/buy" className={styles.link}>
              Buy
            </Link>

            <Link href="/open" className={styles.link}>
              Inventory
            </Link>
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navConnect}>
            <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
          </div>
          {address && (
            <Link className={styles.link} href={`/profile/${address}`}>
              <Image
                className={styles.profileImage}
                src="/user-icon.png"
                width={42}
                height={42}
                alt="Profile"
              />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
