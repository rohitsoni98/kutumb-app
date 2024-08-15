import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { DEFAULT_ERROR_MESSAGE } from "../../helpers/constant/utils";
import API_SERVICE from "../../helpers/service/apiService";
import TableMui from "../../components/tableWrapper";
import AddQuotesDrawer from "./addQuotesDrawer";
import toast from "react-toast";
import moment from "moment";

import "./index.scss";

const { STAGE_CRAFTO } = API_SERVICE;

const QuoteList = () => {
  const [state, setState] = useState({
    loading: true,
    offset: 0,
    pageNo: 1,
    tableData: [],
    totalPages: 5,
    openDrawer: false,
  });
  const { loading, offset, tableData, pageNo, openDrawer, totalPages } = state;

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async (nextOffSet, number) => {
    try {
      const response = await STAGE_CRAFTO.get("/getQuotes", {
        params: { offset: nextOffSet ?? offset, limit: 10 },
      });
      let data = response?.["data"]?.["data"];

      let totalPage =
        data?.length === 10 && (number || pageNo) === totalPages
          ? totalPages + 1
          : totalPages;

      setState((prev) => ({
        ...prev,
        tableData: data && Array.isArray(data) ? data : [],
        totalPages: totalPage,
      }));
    } catch (err) {
      toast.error(err?.["message"] || DEFAULT_ERROR_MESSAGE);
    }
    setState((prev) => ({ ...prev, loading: false }));
  };

  const onPageChange = (number) => {
    let nextPrevOffSet = !number ? 10 : (number - 1) * 10;
    setState((prev) => ({
      ...prev,
      loading: true,
      pageNo: number,
      offset: nextPrevOffSet,
    }));
    fetchTableData(nextPrevOffSet, number);
  };

  const getColumns = () => {
    return [
      {
        Header: "Sno.",
        accessor: "id",
      },
      {
        Header: "User Name",
        accessor: "username",
      },
      {
        Header: "Text",
        accessor: "text",
      },
      {
        Header: "Media Url",
        Cell: ({ row: data }) => (
          <Tooltip arrow placement="right" title={data?.["username"]}>
            <Avatar alt="user_name" src={data?.["mediaUrl"]} />
          </Tooltip>
        ),
      },
      {
        Header: "Created At",
        Cell: ({ row: data }) => moment(data["createdAt"]).format("DD-MM-YYYY"),
      },
      {
        Header: "Updated At",
        Cell: ({ row: data }) => moment(data["updatedAt"]).format("DD-MM-YYYY"),
      },
      {
        Header: "Action",
        align: "center",
        className: "action_cell position_sticky",
        headerClassName: "position_sticky",
        Cell: () => (
          <Tooltip arrow placement="top" title="In Process">
            <IconButton color="primary" size="small">
              <Edit />
            </IconButton>
          </Tooltip>
        ),
      },
    ];
  };

  const toggleDrawer = () => {
    setState((prev) => ({ ...prev, openDrawer: !prev["openDrawer"] }));
  };

  return (
    <>
      <Box className="quotes_container">
        <Stack
          padding="16px"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontSize="20px" fontWeight="500">
            Quotes Table List
          </Typography>

          <Button size="small" variant="contained" onClick={toggleDrawer}>
            Add Quote
          </Button>
        </Stack>

        <Divider sx={{ m: "0 17px" }} />
        <Box className="quotes_table_container">
          <TableMui
            columns={getColumns()}
            pageSize={10}
            page={pageNo}
            minRow={10}
            data={tableData}
            loading={loading}
            pages={totalPages}
            onPageChange={onPageChange}
            NoDataComponent={<Typography>No Data Found !</Typography>}
            disablePagination={loading}
          />
        </Box>
        <Divider sx={{ m: "0 16px" }} />
      </Box>

      {openDrawer && (
        <AddQuotesDrawer
          openDrawer={openDrawer}
          closeDrawer={toggleDrawer}
          onSubmit={() => onPageChange(1)}
        />
      )}
    </>
  );
};

export default QuoteList;
