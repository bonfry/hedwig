type Partner = {
    id: string;
    name: string;
    logo: string;
    position: number;
    link: string;
};

type Partnership = {
    id: string;
    name: string;
    position: number;
    partners: Partner[];
};

type PartnershipAddRequestBody = {
    name: string;
    position?: number;
};

export { Partner, Partnership, PartnershipAddRequestBody}
