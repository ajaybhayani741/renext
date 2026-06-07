import { motion } from "framer-motion";
import CountUp from "./CountUp";

interface KPIBoxProps {
  label: string;
  value: number;
  suffix?: string;
}

const KPIBox = ({ label, value, suffix }: KPIBoxProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="host-kpi flex flex-col items-center justify-center min-w-[140px]"
  >
    <span className="text-xs font-medium text-muted-foreground mb-1">{label}</span>
    <span className="text-2xl font-bold" style={{ color: "#1D5BE0" }}>
      <CountUp end={value} />{suffix}
    </span>
  </motion.div>
);

export default KPIBox;
