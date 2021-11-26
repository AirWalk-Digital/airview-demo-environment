import datetime
import logging
import os
from airviewclient import client, models
import sys

base_url = "http://api"
referencing_type = "cloud_account_id"


root = logging.getLogger()
root.setLevel(logging.DEBUG)

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
root.addHandler(handler)


def get_airview_client(token, system_id):

    client_handler = client.get_handler(
        base_url=base_url,
        system_id=system_id,
        referencing_type=referencing_type,
        token=token,
    )
    return client_handler


def process_items(items, client):
    for item in items:
        logging.info(f"procesing {item.reference}")
        client.set_exclusion_resource_state(
            id=item.id, state=models.ExclusionResourceState.ACTIVE
        )


def invoke():
    logging.info("Starting Run")
    systems = range(1, 10)

    for system_id in systems:
        logging.info(f"processing system id {system_id}")
        client = get_airview_client(None, system_id)
        items = client.get_exclusions_by_state(models.ExclusionResourceState.PENDING)
        process_items(items, client)

    logging.info("Finished Run")


if __name__ == "__main__":
    invoke()
