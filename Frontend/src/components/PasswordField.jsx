import React, { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

export default function PasswordField({ value, onChange }) {
  const [show, setShow] = useState(false)

  return (
    <span className="input-span mb-1" style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        id="password"
        name="password"
        required
        value={value}
        onChange={onChange}
      />
      <label htmlFor="password" className="label">Password</label>

      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "var(--label-color)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {show ? (
            <motion.div
              key="eye-off"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <FiEyeOff size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="eye"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <FiEye size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </span>
  )
}
