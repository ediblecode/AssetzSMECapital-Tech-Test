import { FC, ReactNode } from "react";

import styles from "./Table.module.css";

export interface TableProps {
  caption: ReactNode;
  children: ReactNode;
}

export const Table: FC<TableProps> = ({ children, caption }) => (
  <table className={styles.table}>
    <caption className="visually-hidden">{caption}</caption>
    {children}
  </table>
);
