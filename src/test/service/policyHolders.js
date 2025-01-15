const PolicyHoldersService = require('workspace-service/PolicyHolders');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

describe('PolicyService', () => {
    let policyService;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            queryPolicyDataByCode: sinon.stub(),
        };
        policyService = new PolicyHoldersService(mockRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('搜尋最上級保戶', async () => {
        const mockCode = '1';
        const mockData = {
            code: mockCode,
            policyData: [ { level: 1, code: 1, name: 'Alice', parent_id: null, left_child_id: 2, right_child_id: 3, registration_date: '2024-01-01 10:00:00', introducer_code: null }, { level: 2, code: 2, name: 'Bob', parent_id: 1, left_child_id: 4, right_child_id: 5, registration_date: '2024-01-02 11:00:00', introducer_code: 1 }, { level: 3, code: 4, name: 'David', parent_id: 2, left_child_id: 8, right_child_id: 9, registration_date: '2024-01-03 09:00:00', introducer_code: 2 }, { level: 4, code: 8, name: 'Henry', parent_id: 4, left_child_id: null, right_child_id: null, registration_date: '2024-01-04 09:00:00', introducer_code: 4 }, { level: 4, code: 9, name: 'Ivy', parent_id: 4, left_child_id: 10, right_child_id: null, registration_date: '2024-01-04 10:00:00', introducer_code: 4 }, { level: 5, code: 10, name: 'Jack', parent_id: 9, left_child_id: null, right_child_id: null, registration_date: '2024-01-04 11:00:00', introducer_code: 9 }, { level: 3, code: 5, name: 'Eve', parent_id: 2, left_child_id: null, right_child_id: null, registration_date: '2024-01-03 10:00:00', introducer_code: 2 }, { level: 2, code: 3, name: 'Charlie', parent_id: 1, left_child_id: 6, right_child_id: 7, registration_date: '2024-01-02 12:00:00', introducer_code: 1 }, { level: 3, code: 6, name: 'Frank', parent_id: 3, left_child_id: 11, right_child_id: null, registration_date: '2024-01-03 11:00:00', introducer_code: 3 }, { level: 4, code: 11, name: 'Kim', parent_id: 6, left_child_id: null, right_child_id: null, registration_date: '2024-01-04 12:00:00', introducer_code: 6 }, { level: 3, code: 7, name: 'Grace', parent_id: 3, left_child_id: null, right_child_id: null, registration_date: '2024-01-03 12:00:00', introducer_code: 3 } ]
        };
        mockRepository.queryPolicyDataByCode.resolves(mockData);

        const result = await policyService.getPolicyHolderByCode(mockCode);

        expect(result).to.deep.equal({"code":1,"name":"Alice","registration_date":"2024-01-01 10:00:00","introducer_code":null,"l":[{"code":2,"name":"Bob","registration_date":"2024-01-02 11:00:00","introducer_code":1,"l":[{"code":4,"name":"David","registration_date":"2024-01-03 09:00:00","introducer_code":2,"l":[{"code":8,"name":"Henry","registration_date":"2024-01-04 09:00:00","introducer_code":4,"l":[],"r":[]}],"r":[{"code":9,"name":"Ivy","registration_date":"2024-01-04 10:00:00","introducer_code":4,"l":[{"code":10,"name":"Jack","registration_date":"2024-01-04 11:00:00","introducer_code":9,"l":[],"r":[]}],"r":[]}]}],"r":[{"code":5,"name":"Eve","registration_date":"2024-01-03 10:00:00","introducer_code":2,"l":[],"r":[]}]}],"r":[{"code":3,"name":"Charlie","registration_date":"2024-01-02 12:00:00","introducer_code":1,"l":[{"code":6,"name":"Frank","registration_date":"2024-01-03 11:00:00","introducer_code":3,"l":[{"code":11,"name":"Kim","registration_date":"2024-01-04 12:00:00","introducer_code":6,"l":[],"r":[]}],"r":[]}],"r":[{"code":7,"name":"Grace","registration_date":"2024-01-03 12:00:00","introducer_code":3,"l":[],"r":[]}]}]});

    });

    it('搜尋最下級保戶', async () => {
        const mockCode = '11';
        const mockData = {
            code: mockCode,
            policyData: [{"level":1,"code":11,"name":"Kim","parent_id":6,"left_child_id":null,"right_child_id":null,"registration_date":"2024-01-04 12:00:00","introducer_code":6}]
        };
        mockRepository.queryPolicyDataByCode.resolves(mockData);

        const result = await policyService.getPolicyHolderByCode(mockCode);

        expect(result).to.deep.equal({"code":11,"name":"Kim","registration_date":"2024-01-04 12:00:00","introducer_code":6,"l":[],"r":[]});
    });

    it('搜尋第三級保戶', async () => {
        const mockCode = '4';
        const mockData = {
            code: mockCode,
            policyData: [{"level":1,"code":4,"name":"David","parent_id":2,"left_child_id":8,"right_child_id":9,"registration_date":"2024-01-03 09:00:00","introducer_code":2},{"level":2,"code":8,"name":"Henry","parent_id":4,"left_child_id":null,"right_child_id":null,"registration_date":"2024-01-04 09:00:00","introducer_code":4},{"level":2,"code":9,"name":"Ivy","parent_id":4,"left_child_id":10,"right_child_id":null,"registration_date":"2024-01-04 10:00:00","introducer_code":4},{"level":3,"code":10,"name":"Jack","parent_id":9,"left_child_id":null,"right_child_id":null,"registration_date":"2024-01-04 11:00:00","introducer_code":9}]
        };
        mockRepository.queryPolicyDataByCode.resolves(mockData);

        const result = await policyService.getPolicyHolderByCode(mockCode);

        expect(result).to.deep.equal({"code":4,"name":"David","registration_date":"2024-01-03 09:00:00","introducer_code":2,"l":[{"code":8,"name":"Henry","registration_date":"2024-01-04 09:00:00","introducer_code":4,"l":[],"r":[]}],"r":[{"code":9,"name":"Ivy","registration_date":"2024-01-04 10:00:00","introducer_code":4,"l":[{"code":10,"name":"Jack","registration_date":"2024-01-04 11:00:00","introducer_code":9,"l":[],"r":[]}],"r":[]}]});
    });
});