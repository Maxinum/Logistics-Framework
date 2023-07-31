import usePagination from "@mui/material/usePagination";
import { useSearchParams } from "react-router-dom";
import { Forward, Backward } from "../icons";
import styles from "./Pagination.module.css";

type PaginationProps = {
  /**
   * Object with CSS styles for the container element.
   */
  style: React.CSSProperties;
  /**
   * Total number of items that need to be paginated.
   */
  totalCount: number;
  /**
   * Number of items in a single page.
   */
  pageSize: number;
  /**
   * Number of always visible pages before and after the current page.
   */
  siblingCount?: number;
};

type PageButtonProps = {
  selected: boolean;
  onClick: React.ReactEventHandler<Element>;
  children: React.ReactNode;
};

type NavButtonProps = {
  type: string;
  onClick: React.ReactEventHandler<Element>;
  disabled: boolean;
};

function Dots() {
  return <div className={styles.paginationItem}>...</div>;
}

function PageButton({ selected, onClick, children }: PageButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.paginationItem} ${selected ? styles.active : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function NavButton({ type, onClick, disabled }: NavButtonProps) {
  return (
    <button
      className={`${styles.paginationItem} ${type === "previous" ? styles.back : styles.forward}`}
      onClick={onClick}
      disabled={disabled}
    >
      {type === "previous"
        ? <><Backward /><span>Back</span></>
        : <><span>Forward</span><Forward /></>
      }
    </button>
  );
}

/**
 * Pagination component that calculates the number of pages from the props
 * and manipulates the `page` URL search parameter on page selection.
 * 
 * @param style - Object with CSS styles for the container element.
 * @param totalCount - Total number of items that need to be paginated.
 * @param pageSize - Number of items in a single page.
 * @param siblingCount - Number of always visible pages before and after the current page.
 */
export default function Pagination({
  style,
  totalCount,
  pageSize,
  siblingCount = 1
}: PaginationProps) {
  const [urlParams, setUrlParams] = useSearchParams();
  const numPages = Math.ceil(totalCount / pageSize);
  const currentPage = Number(urlParams.get("page")) || 1;

  const { items } = usePagination({
    page: currentPage,
    count: numPages,
    siblingCount: siblingCount,
    onChange: (_, page) => {
      if (page === currentPage || page < 1 || page > numPages) return;
      if (page === 1) urlParams.delete("page");
      else urlParams.set("page", page.toString());
      setUrlParams(urlParams);
    }
  });

  if (items.length <= 3) return null;

  return (
    <ul className={styles.pagination} style={style}>
      {items.map(({ page, type, onClick }, index) => {
        let children = null;

        if (type === "start-ellipsis" || type === "end-ellipsis") {
          children = <Dots />;
        } else if (type === "page") {
          children = (
            <PageButton
              selected={currentPage === page}
              onClick={onClick}
            >
              {page}
            </PageButton>
          );
        } else {
          children = (
            <NavButton
              type={type}
              onClick={onClick}
              disabled={
                type === "previous"
                  ? currentPage === 1
                  : currentPage === numPages
              }
            />
          );
        }

        return <li key={`pagination-${index}`}>{children}</li>;
      })}
    </ul>
  );
}