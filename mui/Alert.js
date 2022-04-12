import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
// STUB 依賴型別
/**
 * @typedef {import("@mui/material").ButtonProps} ButtonProps - MUI按鈕型別
 */
/**
 * @template T
 * @typedef {import("react").Context<T>} ContextType - Context型別
 */
/**
 * @typedef AlertActionsType - alert按鈕資料型別
 * @property {string} [text="確認"] - 按鈕文字
 * @property {() => void} [onClick=() => {}] - 按鈕行為
 * @property {ButtonProps['variant']} [variant="contained"] - 按鈕樣式
 */
/**
 * @typedef AlertDataType - alert資料型別
 * @property {string} [title="通知"] - 通知標題
 * @property {string} [contentText=""] - 通知內容
 * @property {Array<AlertActionsType>} actions - 按鈕
 */
/**
 * @typedef AlertDispatchType - alert dispatch資料型別
 * @property {'open' | 'close'} type - 控制開關
 * @property {AlertDataType} data - 通知資料
 */
/**
 * @callback AlertReducerCallback - reducer方法回傳
 * @param {AlertDispatchType}
 */
// NOTE alert預設設定
/**
 * @type {AlertDataType} - alert預設設定
 */
const defaultAlertData = {
  title: "通知",
  contentText: "",
  actions: [{ text: "確認", onClick: () => {}, variant: "contained" }],
};
// ANCHOR 創建context
/**
 * @type {ContextType<AlertReducerCallback>}
 */
const AlertContext = createContext(() => {});
// ANCHOR alert的hook
export function useAlert() {
  const alertDataDispatch = useContext(AlertContext);
  /**
   * @param {AlertDataType['title']} title - 標題
   * @param {AlertDataType['contentText']} contentText - 內容
   * @param {AlertDataType['actions']} actions - 按鈕組
   */
  function alert(title, contentText, actions) {
    alertDataDispatch({
      type: "open",
      data: {
        title: title || defaultAlertData.title,
        contentText: contentText || defaultAlertData.contentText,
        actions: actions || defaultAlertData.actions,
      },
    });
  }
  /**
   * @param {AlertDataType['contentText']} contentText - 內容
   * @param {AlertActionsType['onClick']} onClick - 按鈕行為
   * @param {string} [text] - 按鈕文字
   */
  function notify(contentText, onClick, text) {
    alertDataDispatch({
      type: "open",
      data: {
        title: defaultAlertData.title,
        contentText,
        actions: [
          {
            text,
            variant: defaultAlertData.actions[0].variant,
            onClick,
          },
        ],
      },
    });
  }
  return { alert, notify };
}
// ANCHOR alert的provider
const alertDataInit = [];
export const AlertProvider = memo(function AlertProvider({ children }) {
  const [alertData, alertDataDispatch] = useReducer(
    alertDataReducer,
    alertDataInit
  );
  return (
    <AlertContext.Provider value={alertDataDispatch}>
      {children}
      <AlertModal data={alertData} reducerDispatch={alertDataDispatch} />
    </AlertContext.Provider>
  );
});
// NOTE reducer方法
/**
 * @param {Array<AlertDataType>} state - 先前陣列資料
 * @param {AlertDispatchType} action - 陣列行為選項
 * @returns {Array<AlertDataType>} - 回傳新的alert陣列
 */
function alertDataReducer(state, action) {
  switch (action.type) {
    case "open":
      // NOTE 將每次alert的東西推進陣列
      return [...state, action.data];
    case "close":
      // NOTE 移除最後一筆資料，需重新創建物件來刷新state
      state.pop();
      return [...state];
    default:
      // NOTE 未知情況改為預設值
      return alertDataInit;
  }
}
// ANCHOR 通知浮層
/**
 * @typedef AlertModalProps
 * @property {Array<AlertDataType>} data
 * @property {AlertReducerCallback} reducerDispatch
 */
/**
 * @param {AlertModalProps} param0
 * @returns {JSX.Element}
 */
function AlertModal({ data = [], reducerDispatch = () => {} }) {
  // NOTE 不用做memo處理，每次alert都是不同物件，沒有意義
  //ANCHOR 暫存上一筆資料，使畫面渲染符合視覺
  const temporaryRef = useRef({
    title: defaultAlertData.title,
    contentText: defaultAlertData.contentText,
    actions: defaultAlertData.actions,
  });
  const { title, contentText, actions } = useMemo(
    /**
     * @returns {AlertDataType}
     */
    () => {
      // NOTE 暫存第一次的資料
      if (data.length === 1) {
        temporaryRef.current = data[0];
      }
      // NOTE 沒有資料時顯示第一次暫存的資料來過渡畫面
      if (data[0]) {
        return data[data.length - 1];
      } else {
        return temporaryRef.current;
      }
    },
    [data]
  );
  const _onClose = useCallback(() => {
    reducerDispatch({ type: "close" });
  }, [reducerDispatch]);
  /**
   * @param {AlertActionsType} item
   * @param {number} index
   * @returns {JSX.Element}
   */
  function actionsMap(item, index) {
    const defaultItem = defaultAlertData.actions[0];
    const text = item.text ?? defaultItem.text;
    const onClick = item.onClick ?? defaultItem.onClick;
    const variant = item.variant ?? defaultItem.variant;
    return (
      <Button
        key={`action-${index}`}
        variant={variant}
        onClick={() => {
          _onClose();
          onClick();
        }}
      >
        {text}
      </Button>
    );
  }
  return (
    <Dialog open={Boolean(data[0])} onClose={_onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>{actions.map(actionsMap)}</DialogActions>
    </Dialog>
  );
}
