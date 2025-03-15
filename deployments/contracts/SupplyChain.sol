// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Supply Chain Management Smart Contract
contract SupplyChain {
    struct Product {
        uint id;
        string name;
        address manufacturer;
        uint timestamp;
    }

    struct Transfer {
        uint productId;
        address from;
        address to;
        uint timestamp;
    }

    mapping(uint => Product) public products;
    mapping(uint => Transfer[]) public productTransfers;
    uint public productCounter;

    event ProductCreated(uint productId, string name, address indexed manufacturer);
    event ProductTransferred(uint productId, address indexed from, address indexed to);

    // Create a new product by manufacturer
    function createProduct(string memory _name) public {
        productCounter++;
        products[productCounter] = Product(productCounter, _name, msg.sender, block.timestamp);
        emit ProductCreated(productCounter, _name, msg.sender);
    }

    // Transfer product to the next entity in the supply chain
    function transferProduct(uint _productId, address _to) public {
        require(products[_productId].manufacturer != address(0), "Product does not exist");
        require(msg.sender == products[_productId].manufacturer || productTransfers[_productId].length > 0 && productTransfers[_productId][productTransfers[_productId].length - 1].to == msg.sender, "Only current owner can transfer product");
        
        productTransfers[_productId].push(Transfer(_productId, msg.sender, _to, block.timestamp));
        emit ProductTransferred(_productId, msg.sender, _to);
    }

    // Get product details
    function getProduct(uint _productId) public view returns (Product memory) {
        require(products[_productId].manufacturer != address(0), "Product does not exist");
        return products[_productId];
    }

    // Get all transfers of a product
    function getProductTransfers(uint _productId) public view returns (Transfer[] memory) {
        return productTransfers[_productId];
    }
}

// Corporate Governance Smart Contract
contract CorporateGovernance {
    struct GovernanceProposal {
        uint id;
        string description;
        uint voteCount;
        bool executed;
    }

    mapping(uint => GovernanceProposal) public governanceProposals;
    uint public governanceProposalCounter;

    event GovernanceProposalCreated(uint proposalId, string description);

    // Create a governance proposal
    function createGovernanceProposal(string memory _description) public {
        governanceProposalCounter++;
        governanceProposals[governanceProposalCounter] = GovernanceProposal(governanceProposalCounter, _description, 0, false);
        emit GovernanceProposalCreated(governanceProposalCounter, _description);
    }
}

// Decentralized Autonomous Organization (DAO) Smart Contract
contract DAO {
    struct DAOProposal {
        uint id;
        string description;
        uint voteCount;
        bool executed;
    }

    mapping(uint => DAOProposal) public daoProposals;
    uint public daoProposalCounter;

    event DAOProposalCreated(uint proposalId, string description);

    // Create a DAO proposal
    function createDAOProposal(string memory _description) public {
        daoProposalCounter++;
        daoProposals[daoProposalCounter] = DAOProposal(daoProposalCounter, _description, 0, false);
        emit DAOProposalCreated(daoProposalCounter, _description);
    }
}

// Intellectual Property Protection Smart Contract
contract IntellectualProperty {
    struct IPRecord {
        uint id;
        string description;
        address owner;
        uint timestamp;
    }

    mapping(uint => IPRecord) public ipRecords;
    uint public ipRecordCounter;

    event IPRecordCreated(uint recordId, string description, address indexed owner);

    // Register an intellectual property record
    function registerIPRecord(string memory _description) public {
        ipRecordCounter++;
        ipRecords[ipRecordCounter] = IPRecord(ipRecordCounter, _description, msg.sender, block.timestamp);
        emit IPRecordCreated(ipRecordCounter, _description, msg.sender);
    }
}

// Real Estate Transactions Smart Contract
contract RealEstate {
    struct RealEstateProperty {
        uint id;
        string location;
        address owner;
        uint timestamp;
    }

    mapping(uint => RealEstateProperty) public realEstateProperties;
    uint public realEstatePropertyCounter;

    event RealEstatePropertyRegistered(uint propertyId, string location, address indexed owner);

    // Register a real estate property
    function registerRealEstateProperty(string memory _location) public {
        realEstatePropertyCounter++;
        realEstateProperties[realEstatePropertyCounter] = RealEstateProperty(realEstatePropertyCounter, _location, msg.sender, block.timestamp);
        emit RealEstatePropertyRegistered(realEstatePropertyCounter, _location, msg.sender);
    }
}
