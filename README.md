# react-mui-components

## MUI

需要MUI v5，必備依賴項為 @mui/material 其餘依照官方[安裝教學](https://mui.com/zh/getting-started/installation/).

## Alert

> AlertProvider組件要放在ThemeProvider裡面以獲取主題樣式

```example
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AlertProvider } from "/Alert";

function App() {
    const theme = createTheme({});
    return (
        <ThemeProvider theme={theme}>
            <AlertProvider>
                {你的組件}
            </AlertProvider>
        </ThemeProvider>
    );
}
```

### 使用方法

使用useAlert可以獲得alert、notify函式

```example
const {alert, notify} = useAlert();
```

* **alert** 完整的通知設定
* **notify** 簡易的通知設定

### alert()

```example
alert(title, contentText, actions);
```

| 名稱 | 型別 | 描述 |
| ------------- |:-------------:|:-------------:|
| title | string | 通知標題 |
| contentText | string | 通知內容 |
| actions | Actions | 按鈕 |

### notify()

```example
notify(contentText, onClick, text);
```

| 名稱 | 型別 | 預設值 | 描述 |
| ---- | ---- | ---- | ---- |
| contentText | string | "" | 通知內容 |
| onClick | function | () => void  | 按鈕行為 |
| text | string | "" | 確定按鈕文字 |

### 型別

#### Actions

| 型別 |
| ------------- |
| array of objects |

對象屬性

| 名稱 | 型別 | 預設值 | 描述 |
|------|--------|-------|---------|
| text | string | "確認" | 按鈕文字 |
| onClick | function | () => void |  按鈕行為 |
| variant | "contained", "text", "outlined" | "contained" | 按鈕樣式 |
