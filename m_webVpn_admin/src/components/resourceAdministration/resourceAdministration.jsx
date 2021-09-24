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
import { Modal, InputItem, List, Toast } from 'antd-mobile';
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
    const { row, changeResModal, delResource } = props;
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row">
                    {row.res_name}
                </TableCell>
                <TableCell align="center">{row.res_url}</TableCell>
                <TableCell component="th" scope="row">
                    <Button variant="contained" color="secondary" style={{ marginBottom: '5px' }} onClick={() =>
                        delResource(row)
                    }>
                        删除
                    </Button>
                    <Button size="small" variant="contained" style={{ marginBottom: '5px' }} onClick={() => {
                        changeResModal(true, row)
                    }}>编辑</Button>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

// react function 定义状态，Row组件定义状态
Row.propTypes = {
    row: PropTypes.shape({
        res_url: PropTypes.string.isRequired,
        res_name: PropTypes.string.isRequired,
    }).isRequired,
};

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}


// React.Component是以ES6的形式来创建react的组件的，最终会取代React.createClass形式；相对于 React.createClass可以更好实现代码复用。
export default class resourceAdministration extends React.Component {
    state = {
        rows: [],
        page: 0,  // 当前页
        rowsPerPage: 5,  // 每页个数
        modal: false,   // 修改弹出框是否展示
        rowData: '',  // 编辑当前行数据
        resName: '', // 资源名称
        resUrl: '', // 资源url
        resIsChange: false, //  是否修改资源
    }

    componentDidMount() {
        this.renderList();
    }

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }

    // 渲染表格
    renderList = () => {
        // 获取角色信息
        fetch.ResList({}).then(res => {
            if (res.success) {
                // 处理数据
                this.setState({
                    rows: res.data,
                    page: (this.state.page * this.state.rowsPerPage) >= res.data.length ? ((this.state.page -1) < 0 ? 0 : (this.state.page -1)) : this.state.page,  // 如果当前页乘以每页页数的值大于等于总数，渲染当前页减一（当然第一页的话就不能减一了），否则渲染当前页
                })
            }
        })
    }

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    //   修改弹出框状态
    changeResModal = (state, row) => {
        this.setState({
            modal: state,
            rowData: row,
            resName: row.res_name, // 资源名称
            resUrl: row.res_url, // 资源url
            resIsChange: true,
        })
    }
   

    // 修改资源
    changeRes = () => {
        fetch.modResource({
            res_id: this.state.rowData.res_id,
            res_name: this.state.resName,
            res_url: this.state.resUrl,
        }).then(res => {
            if (res.success) {
                Toast.success(res.message,2,()=>{
                    this.renderList();
                });
                this.setState({
                    modal: false,
                });
            }
        })
    }

     // 添加弹出框状态
     addResModal = (state) => {
        this.setState({
            modal: state,
            rowData: {},
            resName: '', // 资源名称
            resUrl: '', // 资源url
            resIsChange: false
        })
    }


    // 添加资源请求
    addRes = ()=>{
        fetch.addResource({
            res_name: this.state.resName,
            res_url: this.state.resUrl,
        }).then(res => {
            if (res.success) {
                Toast.success(res.message,2,()=>{
                    this.renderList();
                });
                this.setState({
                    modal: false,
                });
            }
        })
    }


    // 删除资源
    delResource = (row) => {
        alert('删除', '确定要删除吗?', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定', onPress: () => {
                    fetch.delResource({
                        res_id: row.res_id,
                    }).then(res => {
                        if (res.success) {
                            Toast.success(res.message,2,()=>{
                                this.renderList();
                            });
                        }
                    })
                }
            },
        ])
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
            <Paper >
                <Button variant="contained" color="primary" style={{ display: 'block', margin: '20px 2.5%' }} onClick={ this.addResModal.bind(this,true) }>
                    添加资源
                </Button>
                <TableContainer component={Paper} style={{ width: '95%',margin: 'auto' }}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>资源名称</StyledTableCell>
                                <StyledTableCell align="center">资源Url</StyledTableCell>
                                <StyledTableCell style={{ width: '15%' }}>操作</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                return (
                                    <Row key={row.res_id} row={row} changeResModal={this.changeResModal} delResource={this.delResource} />
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
                            var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~/])+$/;   // eslint-disable-line 

                            console.log(this.state.resName, this.state.resUrl)

                            if (this.state.resName === '') {
                                Toast.fail('请输入资源名称')
                            } else if (this.state.resUrl === '') {
                                Toast.fail('请输入资源URL')
                            } else if (!reg.test(this.state.resUrl)) {
                                Toast.fail('输入错误，这不是一个网址')
                            } else if(this.state.resIsChange){
                                this.changeRes();
                            } else{
                                this.addRes();
                            }

                        }
                    }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <List>
                        <InputItem
                            defaultValue={this.state.rowData.res_name}
                            onChange={(val) => {
                                this.setState({
                                    resName: val
                                })
                            }}
                            clear
                            placeholder="请输入资源名称"
                        ></InputItem>
                        <InputItem
                            defaultValue={this.state.rowData.res_url}
                            onChange={(val) => {
                                this.setState({
                                    resUrl: val
                                })
                            }}
                            clear
                            placeholder="请输入资源Url"
                        ></InputItem>
                    </List>
                </Modal>

            </Paper>
        );
    }


}
