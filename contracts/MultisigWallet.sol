// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MultisigWallet
 * @dev Ví đa chữ ký cho phép nhiều owners quản lý và chỉ thực hiện giao dịch khi đủ số chữ ký
 * @author NGUYỄN ĐĂNG DUY - 22810310021 - D17CNPM1
 */
contract MultisigWallet {
    // Events
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);

    // State variables
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    // Mapping từ tx index => owner address => bool
    mapping(uint => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    // Modifiers
    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    /**
     * @dev Constructor khởi tạo ví với danh sách owners và số chữ ký yêu cầu
     * @param _owners Mảng địa chỉ các owners
     * @param _numConfirmationsRequired Số chữ ký tối thiểu cần thiết
     */
    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    /**
     * @dev Nhận ETH vào ví
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    /**
     * @dev Tạo giao dịch mới
     * @param _to Địa chỉ nhận
     * @param _value Số lượng ETH (wei)
     * @param _data Data để gọi hàm (nếu có)
     * @return txIndex Index của giao dịch vừa tạo
     */
    function submitTransaction(
        address _to,
        uint _value,
        bytes memory _data
    ) public onlyOwner returns (uint txIndex) {
        txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    /**
     * @dev Ký (confirm) một giao dịch
     * @param _txIndex Index của giao dịch
     */
    function confirmTransaction(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    /**
     * @dev Thực hiện giao dịch khi đủ số chữ ký
     * @param _txIndex Index của giao dịch
     */
    function executeTransaction(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    /**
     * @dev Hủy chữ ký đã ký trước đó
     * @param _txIndex Index của giao dịch
     */
    function revokeConfirmation(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    /**
     * @dev Lấy danh sách owners
     * @return Mảng địa chỉ owners
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /**
     * @dev Lấy số lượng giao dịch
     * @return Tổng số giao dịch
     */
    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    /**
     * @dev Lấy thông tin một giao dịch
     * @param _txIndex Index của giao dịch
     * @return to Địa chỉ nhận
     * @return value Số lượng ETH
     * @return data Data
     * @return executed Trạng thái đã thực hiện
     * @return numConfirmations Số chữ ký hiện tại
     */
    function getTransaction(
        uint _txIndex
    )
        public
        view
        returns (
            address to,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    /**
     * @dev Kiểm tra xem owner đã ký giao dịch chưa
     * @param _txIndex Index của giao dịch
     * @param _owner Địa chỉ owner
     * @return true nếu đã ký
     */
    function isTransactionConfirmed(
        uint _txIndex,
        address _owner
    ) public view returns (bool) {
        return isConfirmed[_txIndex][_owner];
    }

    /**
     * @dev Lấy số dư của ví
     * @return Số dư hiện tại (wei)
     */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

