import { getFirestore } from "firebase-admin/firestore";
import { Partnership, PartnershipAddRequestBody } from "../models/partnership.types"

const getPartnerships = async () => {
    const firestore = getFirestore();
    const partnershipsCollection = firestore.collection("partnerships");
    const partnershipsSnaphot = await partnershipsCollection.orderBy("position", "asc").get();

    const partnershipsPromises = partnershipsSnaphot.docs.map(async (partnershipDoc) => {
        const partnership = partnershipDoc.data() as Partnership;

        const partners = firestore.collection(`partnerships/${partnership.id}/partners`);
        const partnersSnapshot = await partners.orderBy("position", "asc").get();

        partnership.partners = partnersSnapshot.docs.map((partnerDoc) => {
            return partnerDoc.data();
        }) as Partnership["partners"];

        return partnership;
    });

    return Promise.all(partnershipsPromises);
}

const addPartnership = async ({ name, position }: PartnershipAddRequestBody) => {
    const firestore = getFirestore();
    const partnershipsCollectionSnapshot = await firestore.collection("partnerships").get()
    const partnershipsCollection = partnershipsCollectionSnapshot.docs.map(doc => doc.data() as Partnership);

    if (position) {
        let thereIsPartnershipWithSamePosition = false;

        do {
            const partnershipWithPosition = partnershipsCollection.filter(partnership => partnership.position === position);

            thereIsPartnershipWithSamePosition = partnershipWithPosition.length > 0;

            if (thereIsPartnershipWithSamePosition) {
                position++;
            }

        } while (thereIsPartnershipWithSamePosition);
    } else if (partnershipsCollection.length > 0) {
        position = partnershipsCollection[partnershipsCollection.length - 1].position + 1;
    } else {
        position = 0;
    }

    const partnershipCollection = firestore.collection("partnerships");

    const newPartnership = await partnershipCollection.add({ name, position });
    await newPartnership.set({ id: newPartnership.id }, { merge: true });

    const newPartnershipData = await newPartnership.get().then(doc => doc.data()) as Partnership;
    newPartnershipData.partners = [];

    
    return newPartnershipData;
}

export { getPartnerships, addPartnership };