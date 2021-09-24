import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import fetch from '../../fetch/fetch';
import { Modal, InputItem, List, Toast } from 'antd-mobile';
import 'element-theme-default';
import { Transfer } from 'element-react';
const alert = Modal.alert;


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
    const { row, changeRoleModal, delRole, changeBindModal } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">{row.role_id}</TableCell>
                <TableCell component="th" scope="row">
                    {row.role_name}
                </TableCell>
                <TableCell component="th" scope="row">
                    <Button variant="contained" color="secondary" style={{ marginBottom: '5px' }} onClick={() => {
                        delRole(row)
                    }}>
                        删除
                    </Button>
                    <Button size="small" variant="contained" style={{ marginBottom: '5px' }} onClick={() => {
                        changeRoleModal(true, row)
                    }}>编辑</Button>
                    <Button size="small" variant="contained" color="primary" onClick={() => {
                        changeBindModal(true, row)
                    }}>
                        绑定
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                绑定资源
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '30%' }}>资源名称</TableCell>
                                        <TableCell>资源url</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        row.role_res_list.map(ele => {
                                            return (
                                                <TableRow key={ele.res_id}>
                                                    <TableCell component="th" scope="row">
                                                        {ele.res_name}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {ele.chg_res_url}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }

                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

// react function 定义状态，Row组件定义状态
Row.propTypes = {
    row: PropTypes.shape({
        role_id: PropTypes.number.isRequired,
        role_name: PropTypes.string.isRequired,
        role_res_list: PropTypes.array.isRequired,
    }).isRequired,
};

// React.Component是以ES6的形式来创建react的组件的，最终会取代React.createClass形式；相对于 React.createClass可以更好实现代码复用。
export default class roleManagement extends React.Component {
    state = {
        rows: [],
        page: 0,
        rowsPerPage: 5,
        modal: false,   // 修改弹出框是否展示
        modal1: false, // 修改绑定弹出框是否展示
        rowData: '',  // 编辑当前行数据
        role_name: '',
        RoleIsChange: false, //  是否修改用户信息
        ResList: [], // 资源list
        value: [], // 穿梭组件已选择key
    }

    componentDidMount() {
        this.renderList();
    }

    // 渲染表格
    renderList = () => {

        // 获取资源信息
        fetch.ResList({}).then(res => {
            if (res.success) {
                this.setState({
                    ResList:res.data.map(ele => {
                        return {
                            key: ele.res_id,
                            label: ele.res_name,
                            disabled: false,
                        }
                    })
                })

                // 获取角色信息
                fetch.roleList({}).then(res1 => {
                    if (res1.success) {
                        res1.data.forEach((role, index) => {
                            var mapRoleInfo = [];
                            role.role_res_id_list.split(',').forEach((roleInfo) => {
                                res.data.forEach(element1 => {
                                    if (Number(roleInfo) === element1.res_id) {
                                        mapRoleInfo.push(element1);
                                    }
                                });
                            })

                            role.role_res_list = mapRoleInfo;
                        });

                        console.log(res1)

                        // 处理数据
                        this.setState({
                            rows: res1.data
                        })
                    }
                })
            }
        })
    }

    // 添加弹出框
    addUserModal = (state) => {
        this.setState({
            modal: state,
            rowData: {},
            role_name: '', // 角色名称
            RoleIsChange: false,  // 是否修改用户信息
        })
    }

    // 添加角色请求
    addRole = () => {
        fetch.addRole({
            role_name: this.state.role_name,
        }).then(res => {
            if (res.success) {
                Toast.success(res.message, 2, () => {
                    this.renderList();
                });
                this.setState({
                    modal: false,
                });
            }
        })
    }

    // 修改弹出框
    changeRoleModal = (state, row) => {
        this.setState({
            modal: state,
            rowData: row,
            role_name: row.role_name,
            RoleIsChange: true,  // 是否修改用户信息
        })
    }

    // 修改用户
    changeRole = () => {
        fetch.modRole({
            role_id: this.state.rowData.role_id,
            role_name: this.state.role_name,
        }).then(res => {
            if (res.success) {
                Toast.success(res.message, 2, () => {
                    this.renderList();
                });
                this.setState({
                    modal: false,
                });
            }
        })
    }

    // 删除角色
    delRole = (row) => {
        alert('删除', '确定要删除吗?', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定', onPress: () => {
                    fetch.delRole({
                        role_id: row.role_id,
                    }).then(res => {
                        if (res.success) {
                            Toast.success(res.message, 2, () => {
                                this.renderList();
                            });
                        }
                    })
                }
            },
        ])
    }

    // 修改绑定弹出在状态  
    changeBindModal = (state, row) => {
        console.log(row)

        this.setState({
            modal1: state,
            value : row.role_res_id_list.split(",").map(Number),
            rowData: row,
        })
    }

    // 穿梭组件切换回调
    handleChange = (value) => {
        this.setState({ value })
    }

    // 修改绑定数据
    changeBindRes = ()=>{
        fetch.bindRes({
            role_id: this.state.rowData.role_id,
            role_res_id_list: this.state.value.join()
        }).then(res=>{
            if(res.success){
                Toast.success(res.message, 2, () => {
                    this.renderList();
                });
                this.setState({
                    modal1: false,
                });
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
            <div className='roleManagement'>
                {/* 绑定弹出框 */}
                <Modal
                    visible={this.state.modal1}
                    className="BindModal"
                    transparent
                    maskClosable={false}
                    title="绑定资源"
                    footer={[{
                        text: '取消', onPress: () => {
                            this.setState({
                                modal1: false,
                            });
                        }
                    },
                    {
                        text: '确定', onPress: () => {
                            this.changeBindRes();
                        }
                    }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <Transfer value={this.state.value} titles={['未绑定', '绑定']} data={this.state.ResList} onChange={this.handleChange}></Transfer>
                </Modal>
                {/* 绑定弹出框 */}

                <Paper >
                    <Button variant="contained" color="primary" style={{ display: 'block', margin: '20px 2.5%' }} onClick={this.addUserModal.bind(this, true)}>
                        添加角色
                    </Button>
                    <TableContainer component={Paper} style={{ width: '95%',margin: 'auto' }}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>绑定</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '30%' }}>角色id</StyledTableCell>
                                    <StyledTableCell style={{ width: '30%' }}>角色名称</StyledTableCell>
                                    <StyledTableCell>操作</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                    return (
                                        <Row key={row.role_id} row={row} changeRoleModal={this.changeRoleModal} delRole={this.delRole} changeBindModal={this.changeBindModal} />
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

                    {/* 编辑弹出框 */}
                    <Modal
                        visible={this.state.modal}
                        transparent
                        maskClosable={false}
                        title="编辑资源"
                        footer={[{
                            text: '取消', onPress: () => {
                                this.setState({
                                    modal: false,
                                });
                            }
                        },
                        {
                            text: '确定', onPress: () => {
                                if (this.state.role_name === '') {
                                    Toast.fail('请输入角色名称')
                                } else if (this.state.RoleIsChange) {
                                    this.changeRole();
                                } else {
                                    this.addRole();
                                }

                            }
                        }]}
                        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    >
                        <List>
                            <InputItem
                                defaultValue={this.state.rowData.role_name}
                                maxLength="10"
                                onChange={(val) => {
                                    this.setState({
                                        role_name: val
                                    })
                                }}
                                clear
                                placeholder="请输入角色名称"
                            ></InputItem>
                        </List>
                    </Modal>
                </Paper>
            </div>

        );
    }


}
