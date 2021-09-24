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
import { $md5 } from '../../utils/common.js'
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
    const { row, changeUserModal, delUser,changeBindModal } = props;
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
                <TableCell component="th" scope="row">
                    {row.user_name}
                </TableCell>
                <TableCell align="center">{row.user_number}</TableCell>
                <TableCell component="th" scope="row">
                    <Button variant="contained" color="secondary" style={{ marginBottom: '5px' }} onClick={() => {
                        delUser(row)
                    }}>
                        删除
                    </Button>
                    <Button size="small" variant="contained" style={{ marginBottom: '5px' }} onClick={() => {
                        changeUserModal(true, row)
                    }}>编辑</Button>
                    <Button size="small" variant="contained" color="primary" onClick={ ()=>{
                        changeBindModal(true,row)
                    } }>
                        绑定
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                绑定角色
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>角色id</TableCell>
                                        <TableCell>角色名称</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row.user_role_id.role_id}>
                                        <TableCell component="th" scope="row">
                                            {row.user_role_id.role_id}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.user_role_id.role_name}
                                        </TableCell>
                                    </TableRow>
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
        user_id: PropTypes.number.isRequired,
        user_name: PropTypes.string.isRequired,
        user_number: PropTypes.string.isRequired,
        user_role_id: '',
    }).isRequired,
};

// React.Component是以ES6的形式来创建react的组件的，最终会取代React.createClass形式；相对于 React.createClass可以更好实现代码复用。
export default class userManagement extends React.Component {
    state = {
        rows: [],
        page: 0,
        rowsPerPage: 5,
        modal: false,   // 修改弹出框是否展示
        modal1: false,   // 绑定弹出框是否展示
        rowData: '',  // 编辑当前行数据
        user_name: '',
        user_number: '',
        user_pwd_md5: '',
        UserIsChange: false, //  是否修改用户信息
        ResList: [], // 资源list
        value: [], // 穿梭组件已选择key
    }

    componentDidMount() {
        this.renderList();
    }

    // 渲染表格
    renderList = () => {

        // 获取角色信息
        fetch.roleList({}).then(res => {
            if (res.success) {
                this.setState({
                    ResList:res.data.map(ele => {
                        return {
                            key: ele.role_id,
                            label: ele.role_name,
                            disabled: false,
                        }
                    })
                })

                // 获取用户信息
                fetch.userList({}).then(res1 => {
                    if (res1.success) {

                        res1.data.forEach((element, index) => {
                            res.data.forEach(element1 => {
                                if (element.user_role_id === element1.role_id) {
                                    res1.data[index].user_role_id = element1;
                                }
                            });
                        });

                        // 处理数据
                        this.setState({
                            rows: res1.data,
                            page: (this.state.page * this.state.rowsPerPage) >= res.data.length ? ((this.state.page - 1) < 0 ? 0 : (this.state.page - 1)) : this.state.page,  // 如果当前页乘以每页页数的值大于等于总数，渲染当前页减一（当然第一页的话就不能减一了），否则渲染当前页
                        })
                    }
                })
            }
        })
    }

    // 添加弹出框状态
    addUserModal = (state) => {
        this.setState({
            modal: state,
            rowData: {},
            user_name: '',
            user_number: '',
            user_pwd_md5: '',
            UserIsChange: false,  // 是否修改用户信息
        })
    }

    // 添加用户请求
    addUser = () => {
        fetch.userAdd({
            user_name: this.state.user_name,
            user_number: this.state.user_number,
            user_pwd_md5: $md5(this.state.user_pwd_md5),
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
    changeUserModal = (state, row) => {
        this.setState({
            modal: state,
            rowData: row,
            user_name: row.user_name,
            user_number: row.user_number,
            user_pwd_md5: '',
            UserIsChange: true,  // 是否修改用户信息
        })
    }

    // 修改用户
    changeUser = () => {
        fetch.userEdit({
            user_id: this.state.rowData.user_id,
            user_name: this.state.user_name,
            user_number: this.state.user_number,
            user_pwd_md5: $md5(this.state.user_pwd_md5),
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

    // 删除用户
    delUser = (row) => {
        alert('删除', '确定要删除吗?', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定', onPress: () => {
                    fetch.userDelete({
                        user_id: row.user_id,
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
            value : row.user_role_id === -1 ? [] : [row.user_role_id.role_id],
            rowData: row,
        })
    }

    // 穿梭组件切换回调
    handleChange = (value) => {
        console.log(value)
        this.setState({ value })
    }

    // 修改绑定数据
    changeBindRole = ()=>{
        if(this.state.value.length > 1){
            Toast.fail('用户只能绑定一个角色');
        } else{
            fetch.bindRole({
                role_id: this.state.value.length === 0 ? -1 :  this.state.value[0],
                user_id: this.state.rowData.user_id,
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
            <div className="userManagement">
                {/* 绑定弹出框 */}
                <Modal
                    visible={this.state.modal1}
                    className="BindModal"
                    transparent
                    maskClosable={false}
                    title="绑定角色"
                    footer={[{
                        text: '取消', onPress: () => {
                            this.setState({
                                modal1: false,
                            });
                        }
                    },
                    {
                        text: '确定', onPress: () => {
                            this.changeBindRole();
                        }
                    }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <Transfer value={this.state.value} titles={['未绑定', '绑定']} data={this.state.ResList} onChange={this.handleChange}></Transfer>
                </Modal>
                {/* 绑定弹出框 */}

                <Paper >
                    <Button variant="contained" color="primary" style={{ display: 'block', margin: '20px 2.5%' }} onClick={this.addUserModal.bind(this, true)}>
                        添加用户
                    </Button>
                    <TableContainer component={Paper} style={{ width: '95%',margin: 'auto' }}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>绑定</StyledTableCell>
                                    <StyledTableCell style={{ width: '30%' }}>用户名称</StyledTableCell>
                                    <StyledTableCell style={{ width: '30%' }} align="center" >用户账号</StyledTableCell>
                                    <StyledTableCell >操作</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                    return (
                                        <Row key={row.user_id} row={row} changeUserModal={this.changeUserModal} delUser={this.delUser} changeBindModal={this.changeBindModal}/>
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
                                if (this.state.user_name === '') {
                                    Toast.fail('请输入用户名')
                                } else if (this.state.user_number === '') {
                                    Toast.fail('请输入用户账号')
                                } else if (this.state.user_pwd_md5 === '') {
                                    Toast.fail('请输入用户密码')
                                } else if (this.state.UserIsChange) {
                                    this.changeUser();
                                } else {
                                    this.addUser();
                                }

                            }
                        }]}
                        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    >
                        <List>
                            <InputItem
                                defaultValue={this.state.rowData.user_name}
                                maxLength="10"
                                onChange={(val) => {
                                    this.setState({
                                        user_name: val
                                    })
                                }}
                                clear
                                placeholder="请输入用户名称"
                            ></InputItem>
                            <InputItem
                                defaultValue={this.state.rowData.user_number}
                                maxLength="8"
                                onChange={(val) => {
                                    this.setState({
                                        user_number: val
                                    })
                                }}
                                clear
                                placeholder="请输入用户账号"
                            ></InputItem>
                            <InputItem
                                type="password"
                                onChange={(val) => {
                                    this.setState({
                                        user_pwd_md5: val
                                    })
                                }}
                                clear
                                placeholder="请输入用户密码"
                            ></InputItem>
                        </List>
                    </Modal>
                </Paper>
            </div>

        );
    }


}
