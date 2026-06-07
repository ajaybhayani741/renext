import { ReactNode } from "react";
import { motion } from "framer-motion";

const ChartCard = ({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`host-chart-container ${className}`}
  >
    <h3 className="text-base font-semibold text-foreground mb-5">{title}</h3>
    <div className="overflow-x-auto">
      <div style={{ minWidth: 480, maxWidth: 600, margin: "0 auto" }}>
        {children}
      </div>
    </div>
  </motion.div>
);

export default ChartCard;
