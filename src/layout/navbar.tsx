"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import styles from "./navbar.module.css"
import Logo from "../../public/logos/logo-japon.png"
import { Button } from "@/components/ui/button"

const navItems = ["Inicio", "Destinos", "Itinerarios"]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)

  return (
    <div className={styles.wrapper}>
      <div className={styles.navContainer}>
        <div className={styles.logoGroup}>
          <motion.div
            className={styles.logoIcon}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Image src={Logo} alt="Logo" className={styles.logo} />
          </motion.div>
        </div>

        <nav className={styles.desktopNav}>
          {navItems.map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <a href="#" className={styles.desktopLink}>
                {item}
              </a>
            </motion.div>
          ))}
        </nav>

        <Button variant="secondary" className={styles.desktopCtaLink}>Ver Destinos</Button>

        <motion.button
          type="button"
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
          aria-label="Open menu"
        >
          <Menu className={styles.icon} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              type="button"
              className={styles.closeButton}
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Close menu"
            >
              <X className={styles.icon} />
            </motion.button>
            <div className={styles.mobileMenuList}>
              {navItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <a href="#" className={styles.mobileLink} onClick={toggleMenu}>
                    {item}
                  </a>
                </motion.div>
              ))}

              <Button variant="secondary">Ver Destinos</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

