import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";

// ANCHOR 主要組件
/**
 * @typedef {import('@mui/material').TableProps} TableProps
 * @typedef {import('@mui/material').TableBodyProps} TableBodyProps
 * @typedef {import('@mui/material').TableCellProps} TableCellProps
 * @typedef {import('@mui/material').TableContainerProps} TableContainerProps
 * @typedef {import('@mui/material').TableHeadProps} TableHeadProps
 * @typedef {import('@mui/material').TableRowProps} TableRowProps
 * @typedef {import('@mui/material').TableFooterProps} TableFooterProps
 */
/**
 * @typedef {Omit<TableRowProps, 'children'> & {children: TableCellProps[]}} tableItem
 */
/**
 * @template ItemT
 * @typedef CombinedTableProps - 組件型別
 * @property {Array<ItemT>} data - 表格資料
 * @property {tableItem} head - 表格標頭
 * @property {tableItem} footer - 表格尾部
 * @property {(item: ItemT, index: number) => tableItem} body - 資料渲染
 * @property {TableCellProps} emptyItem - 空資料時渲染
 * @property {(item: ItemT, index: number) => string} keyExtractor - 生成陣列key
 * @property {Omit<TableProps, 'children'>} tableProps - table組件屬性
 * @property {Omit<TableContainerProps, 'children'>} tableContainerProps - tableContainer組件屬性
 * @property {Omit<TableHeadProps, 'children'>} tableHeadProps - tableHeadProps組件屬性
 * @property {Omit<TableBodyProps, 'children'>} tableBodyProps - tableBodyProps組件屬性
 * @property {Omit<TableFooterProps, 'children'>} tableFooterProps - tableFooterProps組件屬性
 */
/**
 * @template T - 泛型對應到data的位置
 * @param {CombinedTableProps<T>} param0 - 表格屬性
 * @returns {React.ReactNode} - 回傳畫面
 */
export default function CombinedTable({
  data = [],
  head,
  body,
  footer,
  keyExtractor,
  tableProps,
  tableContainerProps,
  tableHeadProps,
  tableBodyProps,
  tableFooterProps,
  emptyItem,
}) {
  // NOTE 渲染資料本體
  function _renderBody() {
    const renderData = arrayDebug(data);
    if (renderData.length > 0) {
      if (typeof body === "function") {
        return renderData.map((item, index) => {
          const { children, ...otherBody } = body(item, index);
          const key =
            typeof keyExtractor === "function"
              ? keyExtractor(item, index)
              : index;
          return (
            <TableRow {...otherBody} key={key}>
              {arrayDebug(children).map((child, childIndex) => (
                <TableCell {...child} key={childIndex} />
              ))}
            </TableRow>
          );
        });
      } else {
        return null;
      }
    } else {
      // NOTE 沒有資料時可選顯示
      if (head && emptyItem) {
        const { children } = head;
        return (
          <TableRow>
            <TableCell colSpan={arrayDebug(children).length} {...emptyItem} />
          </TableRow>
        );
      } else {
        return null;
      }
    }
  }
  return (
    <TableContainer {...tableContainerProps}>
      <Table {...tableProps}>
        <TableHead {...tableHeadProps}>{_renderStatic(head)}</TableHead>
        <TableBody {...tableBodyProps}>{_renderBody()}</TableBody>
        <TableFooter {...tableFooterProps}>{_renderStatic(footer)}</TableFooter>
      </Table>
    </TableContainer>
  );
}
function _renderStatic(params) {
  if (params) {
    const { children, ...other } = params;
    return (
      <TableRow {...other}>
        {arrayDebug(children).map((item, index) => (
          <TableCell {...item} key={index} />
        ))}
      </TableRow>
    );
  } else {
    return null;
  }
}
// NOTE 預處理判斷是否為陣列
function arrayDebug(params) {
  return Array.isArray(params) ? params : [];
}
