
from flask import Flask, request
from pprint import pprint
from airviewclient import client, models
import logging
import psycopg2

app = Flask(__name__)
@app.route("/shim/compliance-events", methods=["PUT"])
def temp():
    pprint(request.json)
    data = request.json

    referencing_type = 'cloud_account_id'

    application = models.Application(
        name=data['application'],
        reference=data['application'].replace(' ', ''),
        environment=models.Environment(abbreviation="DEV", name="Development"),
    )

    client_handler = client.get_handler(
        base_url='http://api',
        system_name='dummy',
        system_stage=models.SystemStage.MONITOR,
        referencing_type=referencing_type,
        token=None,
    )

    # TODO handle other types
    control_type = (
        models.TechnicalControlType.TASK
        if data["control_type"] == "task"
        else models.TechnicalControlType.TASK
    )

    technical_control = models.TechnicalControl(
        name=data["control_name"],
        reference=data["control_name"].replace(" ","-"),
        quality_model=models.QualityModel.SECURITY,
        type=control_type,
    )

    pprint(data)
    # Send the compliance event
    compliance_event = models.ComplianceEvent(
        application=application,
        technical_control=technical_control,
        resource_reference=data["resource"],
        status=models.MonitoredResourceState.FLAGGED
        if data["is_active"]
        else models.MonitoredResourceState.FIXED_AUTO,
        type=models.MonitoredResourceType.VIRTUAL_MACHINE
        if data["resource_type"] == "virtual_machine"
        else models.MonitoredResourceType.VIRTUAL_MACHINE,  # TODO: do we need a 'user devices' type
        additional_data= ""
    )

    client_handler.handle_compliance_event(compliance_event)

    return "ok"

@app.route("/shim/exclusions", methods=["DELETE"])
def delete_exclusions():
    query = "update monitored_resource set exclusion_id=null, exclusion_state=null, monitoring_state='FIXED_AUTO';"
    conn = psycopg2.connect(
        database='postgres',
        user='postgres',
        password='postgres',
        host='db',
    )
    cursor = conn.cursor()

    cursor.execute(query)

    conn.commit()
    cursor.close()
    conn.close()
    return "ok"



if __name__ == "__main__":
    app.run(port=5001, host="0.0.0.0")
