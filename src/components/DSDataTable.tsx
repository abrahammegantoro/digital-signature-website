'use client'
import classNames from "classnames";
import {
    Button,
    Checkbox,
    Pagination,
    Table,
    TableProps,
    Tooltip,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPencilAlt, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import DSConditionalLink from "./DSConditionalLink";
import { usePathname } from 'next/navigation'

interface Column {
    key: string;
    label?: string;
}

interface ScopedSlots<T> {
    [key: string]: (rowData: T, rowIndex: number) => React.ReactNode;
}

interface Item extends Record<string, any> {
    disableDownload?: boolean;
    disableVerify?: boolean;
    disableAssign?: boolean;
    disableActions?: boolean;
}

interface Props<T> extends TableProps {
    items: (Item & T)[];
    isPaginated?: boolean;
    pageSize?: number;
    totalItemsCount?: number;
    page?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (page: number) => void;
    columns?: (Column | string)[];
    scopedSlots?: ScopedSlots<T>;
    onSelectedRowIdsChange?: (rowData: any) => void;
    selectedRowIds?: (string | number)[];
    key?: string;
    disableMultiDownload?: boolean;
    disableMultiActions?: boolean;
    disableCheckboxes?: boolean;
    disableActions?: boolean;
    disableAssign?: boolean;
    disableVerify?: boolean;
    disableDownload?: boolean;
    onVerify?: (data: number) => any;
    onDownload?: (data: T) => any;
    onAssign?: (data: number) => any;
    onAdd?: (data: T) => any;
    showKeys?: boolean;
    title?: string;
}

enum PredefinedKeys {
    CHECK = "check",
    ACTIONS = "actions",
}

const removeUnderscore = (key: string) => key.replace(/_/g, " ");

export default function DSDataTable<T>(props: Props<T>) {
    const pathname = usePathname()
    const {
        items,
        columns: columnsProp,
        scopedSlots = {},
        striped = false,
        selectedRowIds: selectedRowIdsProp,
        disableCheckboxes = false,
        disableMultiActions = false,
        disableActions: disableActionsProp = false,
        disableDownload: disableDownloadProp = false,
        disableAssign: disableAssignProp = false,
        disableVerify: disableVerifyProp = false,
        isPaginated = true,
        onPageChange,
        onSelectedRowIdsChange,
        onDownload,
        onAssign,
        onVerify,
        onAdd,
        showKeys = false,
        title,
        key = "id",
        page = 0,
        totalItemsCount = 0,
        pageSize = 10,
        ...rest
    } = props;

    const itemIds = items.map((a) => String(a["id"]));
    const [selectedIdsState, setSelectedIds] = useState<(string | number)[]>(
        selectedRowIdsProp || []
    );
    const selectedIds = (
        selectedRowIdsProp?.length ? selectedRowIdsProp : selectedIdsState
    ).map((id) => String(id));

    useEffect(() => {
        if (onSelectedRowIdsChange) {
            onSelectedRowIdsChange(selectedIdsState);
        }
    }, [selectedIdsState]);

    const columns = React.useMemo(() => {
        let cols = [];
        if (columnsProp && columnsProp.length > 0) {
            cols = columnsProp.map((col) =>
                typeof col === "string" ? { key: col, label: col } : col
            );
        } else {
            cols =
                items.length > 0
                    ? Object.keys(Object.assign({}, items[0])).map((key) => ({
                        key,
                        label: key,
                    }))
                    : [];
        }
        if (!disableCheckboxes) {
            cols.unshift({
                key: "check",
                label: "",
            });
        }
        if (
            !disableActionsProp &&
            (!disableDownloadProp || !disableAssignProp || !disableVerifyProp)
        ) {
            cols.push({
                key: "actions",
                label: "Actions",
            });
        }
        if (!showKeys) {
            cols = cols.filter((col) => col.key !== key);
        }
        return cols;
    }, [columnsProp, items, disableCheckboxes, showKeys]);

    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked;
        const selectedId = event.target.name;
        if (checked) {
            setSelectedIds((prev) => [...prev, selectedId]);
        } else {
            setSelectedIds((prev) => prev.filter((a) => a !== selectedId));
        }
    }

    function handleCheckAll(event: React.ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked;
        if (checked) {
            setSelectedIds((prev) => [...prev, ...itemIds]);
        } else {
            setSelectedIds((prev) => prev.filter((id) => !itemIds.includes(String(id))));
        }
    }

    const hasSelectedRows = selectedIds.length > 0;

    function handlePageChange(page: number) {
        if (onPageChange) {
            onPageChange(page - 1);
        } else {
            console.log(page - 1);
        }
    }

    return (
        <>
            <div className="flex items-center mb-4">
                {title && (
                    <h1
                        className={classNames(
                            "text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl pr-3",
                            hasSelectedRows &&
                            !disableMultiActions &&
                            "border-r border-gray-100 dark:border-gray-700"
                        )}
                    >
                        {title}
                    </h1>
                )}
                {!disableMultiActions && (
                    <div
                        className={classNames(
                            hasSelectedRows ? "flex items-center" : "hidden",
                            "space-x-1 ml-2"
                        )}
                    >
                        <small className="text-gray-400 mx-3">
                            {selectedIds.length} selected rows
                        </small>
                        <a
                            href="#"
                            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <span className="sr-only">Download</span>
                            <HiTrash className="text-2xl" />
                        </a>
                    </div>
                )}
                <div className="ml-auto flex gap-3">
                    <DSConditionalLink to="/input/nilai" disabled={Boolean(onAdd)}>
                        <Button className="flex items-center justify-center">
                            <HiPlus />
                            Add Data
                        </Button>
                    </DSConditionalLink>
                </div>
            </div>

            <div className="overflow-x-scroll w-full">
                <Table striped={striped} {...rest}>
                    <Table.Head>
                        {columns.map((column) => (
                            <Table.HeadCell className="min-w-[200px]" key={column.key}>
                                {column.key === PredefinedKeys.CHECK ? (
                                    <Checkbox onChange={handleCheckAll} />
                                ) : (
                                    removeUnderscore(column.label as string)
                                )}
                            </Table.HeadCell>
                        ))}
                    </Table.Head>
                    <Table.Body>
                        {items.map((item, index) => {
                            const disableActions = disableActionsProp || item.disableActions;
                            const disableAssign = disableAssignProp || item.disableAssign;
                            const disableVerify = disableVerifyProp || item.disableVerify;
                            const disableDownload = disableDownloadProp || item.disableDownload;
                            const isSelected = selectedIds.includes(item[key]);
                            return (
                                <Table.Row
                                    key={index}
                                    className={classNames(
                                        isSelected && "bg-primary-50 dark:bg-primary-900"
                                    )}
                                >
                                    {columns.map((column) => (
                                        <Table.Cell key={column.key}>
                                            {scopedSlots &&
                                                scopedSlots[column.key] &&
                                                typeof scopedSlots[column.key] === "function" ? (
                                                scopedSlots[column.key]?.(item, index)
                                            ) : column.key === PredefinedKeys.CHECK ? (
                                                <Checkbox
                                                    id={item[key]}
                                                    name={item[key]}
                                                    checked={isSelected}
                                                    onChange={handleCheckboxChange}
                                                />
                                            ) : column.key === PredefinedKeys.ACTIONS &&
                                                !disableActions ? (
                                                <div className="flex space-x-3">
                                                    {!disableAssign && (
                                                        <Button
                                                            onClick={() => onAssign && onAssign(index)}
                                                        >
                                                            Assign DS
                                                        </Button>
                                                    )}
                                                    {!disableVerify && (
                                                        <Button
                                                            color="warning"
                                                            onClick={() => onVerify && onVerify(index)}
                                                        >
                                                            Verify DS
                                                        </Button>
                                                    )}
                                                    {!disableDownload && onDownload && (
                                                        <Button
                                                            color="success"
                                                            onClick={() => onDownload(item)}
                                                        >
                                                            Download Report
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                item[column.key]
                                            )}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </div>
            {totalItemsCount > pageSize && (
                <div className="flex overflow-x-auto sm:justify-end">
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(totalItemsCount / pageSize)}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}