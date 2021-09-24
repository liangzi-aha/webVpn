import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import fetch from '../../fetch/fetch';
import 'element-theme-default';
import { getCookie } from '../../utils/common';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

// 自定义tableHeader
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);


// 每行渲染标签格式
function Row(props) {
    const { row } = props;
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row">
                    {row.res_name}
                </TableCell>
                <TableCell align="center">{row.res_url}</TableCell>
                <TableCell align="center" component="th" scope="row">
                    <Button size="small" variant="contained" color="primary" style={{ marginBottom: '5px' }}>
                        <a href={ row.chg_res_url } target="_blank" rel="noopener noreferrer" style={{ color:'white' }}>
                            跳转url
                        </a>
                    </Button>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

// react function 定义状态，Row组件定义状态
Row.propTypes = {
    row: PropTypes.shape({
        res_name: PropTypes.string.isRequired,
        res_url: PropTypes.string.isRequired,
    }).isRequired,
};

// React.Component是以ES6的形式来创建react的组件的，最终会取代React.createClass形式；相对于 React.createClass可以更好实现代码复用。
export default class userManagement extends React.Component {
    state = {
        rows: [],
        page: 0,
        rowsPerPage: 5,
        modal: false,   // 修改弹出框是否展示
    }

    componentDidMount() {
        this.renderList();
    }

    // 渲染表格
    renderList = () => {
        // 获取用户信息
        fetch.user_get_resource({
            user_id: Number(getCookie('user_id'))
        }).then(res => {
            if (res.success) {
                // 处理数据
                this.setState({
                    rows: res.data,
                    page: (this.state.page * this.state.rowsPerPage) >= res.data.length ? ((this.state.page - 1) < 0 ? 0 : (this.state.page - 1)) : this.state.page,  // 如果当前页乘以每页页数的值大于等于总数，渲染当前页减一（当然第一页的话就不能减一了），否则渲染当前页
                })
            }
        })
    }

    render() {
        const handleChangePage = (event, newPage) => {
            this.setState({
                page: newPage
            })
        };

        const handleChangeRowsPerPage = (event) => {
            this.setState({
                page: 0,
                rowsPerPage: event.target.value
            })
        };

        return (
            <div className="userManagement" style={{ marginTop: '20px' }}>
                <Paper >
                    <TableContainer component={Paper} style={{ width: '95%',margin: 'auto' }}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{ width: '33%' }}>资源名称</StyledTableCell>
                                    <StyledTableCell style={{ width: '33%' }} align="center" >资源url</StyledTableCell>
                                    <StyledTableCell align="center">操作</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                    return (
                                        <Row key={row.res_id} row={row}/>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={this.state.rows.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>

        );
    }


}
