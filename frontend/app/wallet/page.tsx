'useclient'

import walletPicture from "@/public/images/logos/wallet.jpg"
import { Link } from "react-bootstrap-icons"
import { Image } from "react-bootstrap"

export default function wallet(){
    return(
        <div>
            <Link>
            <Image
                src={walletPicture}
                alt="Wallet"
                width={100}
                height={100}
                className="img-fluid rounded-2"
                style={{ objectFit: 'contain' }}

            />
            </Link>
        </div>
    )
}