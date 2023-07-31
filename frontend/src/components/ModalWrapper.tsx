import {
  Box,
  Modal,
  IconButton
} from "@mui/material";

type ModalWrapperProps = {
  /**
   * Is the modal open?
   */
  isOpen: boolean;
  /**
   * Function that toggles the isOpen state of the modal
   */
  handleToggle: () => void;
  /**
   * Contents of the modal
   */
  children: React.ReactNode;
  /**
   * Styles for the modal contents' container element that also includes
   * the modal header with the close button and (if passed) a modal title
   */
  style?: React.CSSProperties;
  /**
   * ID of an element that is used as the modal title if nothing is passed
   * the default modal title's id is used as the value of this property
   */
  labelBy?: string;
  /**
   * ID of an element that is used as the modal description
   */
  describeBy?: string;
  /**
   * Title of the modal rendered at the top of the modal
   */
  title?: string;
  /**
   * Should the modal close when user clicks outside of it?
   */
  closeOnClickAway?: boolean;
};

const muiStyles = {
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "scroll",
    padding: "40px"
  },
  contents: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "12px",
    flexDirection: "column",
    gap: "24px",
    outline: "none",
    padding: "28px 36px",
    margin: "auto",
  },
  btnClose: {
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.4)",
    color: "var(--blue)",
    fontSize: "1rem",
    height: "30px",
    marginLeft: "auto",
    width: "30px",
  },
  title: {
    fontWeight: "500",
    fontSize: "20px",
    color: "var(--blue)",
  }
};

/**
 * Modal wrapper with a predefined and styled close button. 
 * Accepts modal contents as children.
 * 
 * @example
 *  const [isModalOpen, setIsModalOpen] = useState(false);
 * 
 *  <ModalWrapper
 *    style={{ fontSize: "1.125rem" }}
 *    isOpen={isModalOpen}
 *    handleToggle={() => setIsModalOpen(prevState => !prevState)}
 *    labelBy="some-label"
 *    describeBy="some-description"
 *  >
 *    <h3 id="some-label">Summary</h3>
 *    <p id="some-description">Summarizing the summary...</p>
 *  </ModalWrapper>
 */
export default function ModalWrapper({
  style,
  title,
  isOpen,
  describeBy,
  handleToggle,
  closeOnClickAway = true,
  labelBy = "modal-wrapper-title",
  children
}: ModalWrapperProps) {
  return (
    <Modal
      aria-labelledby={labelBy}
      aria-describedby={describeBy}
      sx={muiStyles.root}
      open={isOpen}
      onClose={(_, reason) => {
        if (reason === "backdropClick" && !closeOnClickAway) return;
        handleToggle();
      }}
    >
      <Box sx={{ ...muiStyles.contents, ...style }}>
        <Box display="flex" flexDirection="row" alignItems="center">
          {title ? <p id="modal-wrapper-title" style={muiStyles.title}>{title}</p> : null}
          <IconButton
            aria-label="close modal"
            onClick={handleToggle}
            sx={muiStyles.btnClose}
          >
            <span aria-hidden style={{ transform: "rotate(45deg)" }}>+</span>
          </IconButton>
        </Box>

        {children}
      </Box>
    </Modal>
  );
}