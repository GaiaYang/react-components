import React, {
  useContext,
  createContext,
  useReducer,
  useMemo,
  memo,
  useRef,
  useCallback,
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
 * @typedef {import("@mui/material").ButtonProps} ButtonProps MUI按鈕型別
 */
/**
 * @template T
 * @typedef {T extends Array<infer E> ? E : never;} ElementOfArray 解構陣列型別
 */
/**
 * @typedef AlertActionsType alert按鈕資料型別
 * @property {string} text 按鈕文字
 * @property {() => void} onClick 按鈕行為
 * @property {ButtonProps['variant']} variant 按鈕樣式
 */
/**
 * @typedef AlertDataType alert資料型別
 * @property {string} title 通知標題
 * @property {string} contentText 通知內容
 * @property {AlertActionsType[]} actions 按鈕
 */
/**
 * @typedef AlertDispatchType alert dispatch資料型別
 * @property {'open' | 'close'} type 控制開關
 * @property {AlertDataType} data 通知資料
 */
// NOTE alert預設設定
/**
 * @type {AlertDataType} alert預設設定
 */
const defaultAlertData = {
  title: "通知",
  contentText: "",
  actions: [{ text: "確認", onClick: () => {}, variant: "contained" }],
};
// ANCHOR 創立context
const AlertContext = createContext(
  /**
   * @param {AlertDispatchType} _ alert dispatch可用項目
   */
  (_) => {}
);
// ANCHOR alert的hook
export function useAlert() {
  const alertDataDispatch = useContext(AlertContext);
  /**
   * @param {AlertDataType['title']} title 標題
   * @param {AlertDataType['contentText']} contentText 內容
   * @param {AlertDataType['actions']} actions 按鈕組
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
   * @param {AlertDataType['contentText']} contentText 內容
   * @param {ElementOfArray<AlertDataType['actions']>['onClick']} onClick 按鈕行為
   * @param {string} text 按鈕文字
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
// ANCHOR alert的通用層
const alertDataInit = [];
export const AlertProvider = memo(function AlertProvider({ children }) {
  const alertDataReducer = useCallback(
    /**
     * @param {AlertDataType[]} state 先前陣列資料
     * @param {AlertDispatchType} action 陣列行為選項
     * @returns {AlertDataType[]} 回傳新的alert陣列
     */
    (state, action) => {
      switch (action.type) {
        case "open":
          // NOTE 將每次alert的東西推進陣列
          return [...state, action.data];
        case "close":
          // NOTE 移除最後一筆資料
          const newState = state.slice();
          newState.pop();
          return newState;
        default:
          // NOTE 未知情況改為預設值
          return alertDataInit;
      }
    },
    []
  );
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
// ANCHOR 通知浮層
/**
 * @typedef AlertModalProps
 * @property {AlertDataType[]} data
 * @property {(callback: AlertDispatchType) => void} reducerDispatch
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
  function _onClose() {
    reducerDispatch({ type: "close" });
  }
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
          onClick();
          _onClose();
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
