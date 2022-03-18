import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
 */
/**
 * @template T
 * @typedef {T extends Array<infer E> ? E : never} ElementOfArray
 */
/**
 * @typedef {Omit<TableRowProps, 'children'> & {children: TableCellProps[]}} tableItem
 */
/**
 * @template ItemT
 * @typedef CombinedTableProps
 * @property {ItemT} data 表格資料
 * @property {tableItem} head 表格標頭
 * @property {(item: ElementOfArray<ItemT>, index: number) => tableItem} body 資料渲染
 * @property {(item: ElementOfArray<ItemT>, index: number) => string} keyExtractor 生成陣列key
 * @property {Omit<TableProps, 'children'>} tableProps table組件屬性
 * @property {Omit<TableContainerProps, 'children'>} tableContainerProps tableContainer組件屬性
 * @property {Omit<TableHeadProps, 'children'>} tableHeadProps tableHeadProps組件屬性
 * @property {Omit<TableBodyProps, 'children'>} tableBodyProps tableBodyProps組件屬性
 */
/**
 * @template T 泛型對應到data的位置
 * @param {CombinedTableProps<T>} param0 表格屬性
 * @returns {React.ReactNode} 回傳畫面
 */
export default function CombinedTable({
  data = [],
  head,
  body,
  keyExtractor,
  tableProps,
  tableContainerProps,
  tableHeadProps,
  tableBodyProps,
}) {
  // NOTE 預處理判斷是否為陣列
  function arrayDebug(params) {
    return Array.isArray(params) ? params : [];
  }
  // NOTE 渲染標題
  function renderHead() {
    if (head) {
      const { children, ...otherHead } = head;
      return (
        <TableRow {...otherHead}>
          {arrayDebug(children).map((item, index) => (
            <TableCell {...item} key={index} />
          ))}
        </TableRow>
      );
    }
    return null;
  }
  // NOTE 渲染資料本體
  function renderBody() {
    if (typeof body === "function") {
      return arrayDebug(data).map((item, index) => {
        const { children, ...otherBody } = body(item);
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
    }
    return null;
  }
  return (
    <TableContainer {...tableContainerProps}>
      <Table {...tableProps}>
        <TableHead {...tableHeadProps}>{renderHead()}</TableHead>
        <TableBody {...tableBodyProps}>{renderBody()}</TableBody>
      </Table>
    </TableContainer>
  );
}
